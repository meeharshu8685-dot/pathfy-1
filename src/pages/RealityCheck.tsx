import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2, Target, Brain, Sparkles, Coins } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTokens } from "@/hooks/useTokens";
import { TokenDisplay } from "@/components/shared/TokenDisplay";
import { AdaptiveQuiz, QuizResults } from "@/components/reality-check/AdaptiveQuiz";
import { AchievementPlan, AchievementPlanData } from "@/components/reality-check/AchievementPlan";

const FIELDS = [
  { value: "tech", label: "Technology & Software" },
  { value: "exams", label: "Competitive Exams" },
  { value: "business", label: "Business & Management" },
  { value: "sports", label: "Sports & Fitness" },
  { value: "arts", label: "Arts & Creative" },
  { value: "govt", label: "Government Jobs" },
  { value: "other", label: "Other" },
];

const SKILL_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

type Step = "input" | "quiz" | "analyzing" | "result";

const TOKEN_COST = 2;

export default function RealityCheck() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tokens, spendTokens, canAfford } = useTokens();

  const [step, setStep] = useState<Step>("input");
  const [goal, setGoal] = useState("");
  const [field, setField] = useState("tech");
  const [skillLevel, setSkillLevel] = useState("beginner");
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [deadlineValue, setDeadlineValue] = useState(3);
  const [deadlineUnit, setDeadlineUnit] = useState<"weeks" | "months">("months");
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  const [result, setResult] = useState<AchievementPlanData | null>(null);
  const [savedGoalId, setSavedGoalId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const deadlineWeeks = deadlineUnit === "months" ? deadlineValue * 4 : deadlineValue;

  const handleStartQuiz = () => {
    if (!goal.trim()) {
      toast({ title: "Please enter a goal", variant: "destructive" });
      return;
    }
    setStep("quiz");
  };

  const handleQuizComplete = async (results: QuizResults) => {
    setQuizResults(results);
    await runAnalysis(results);
  };

  const handleSkipQuiz = async () => {
    await runAnalysis(null);
  };

  const runAnalysis = async (quiz: QuizResults | null) => {
    if (!user) {
      toast({ title: "Please sign in to continue", variant: "destructive" });
      navigate("/login");
      return;
    }

    if (!canAfford(TOKEN_COST)) {
      toast({ title: "Not enough tokens", description: `You need ${TOKEN_COST} tokens for analysis`, variant: "destructive" });
      return;
    }

    setStep("analyzing");

    try {
      const { data, error } = await supabase.functions.invoke("analyze-goal", {
        body: {
          type: "reality-check-v2",
          goal,
          field,
          skillLevel,
          calibratedSkillLevel: quiz?.calibratedLevel || skillLevel,
          hoursPerWeek,
          deadlineWeeks,
          quizResults: quiz,
        },
      });

      if (error) throw error;

      const analysisResult = data.result as AchievementPlanData;
      setResult(analysisResult);

      // Spend tokens
      await spendTokens.mutateAsync({ amount: TOKEN_COST, feature: "reality-check", description: "Career Reality Check analysis" });

      // Save to database
      const { data: savedGoal, error: saveError } = await supabase
        .from("goals")
        .insert({
          user_id: user.id,
          title: goal,
          skill_level: skillLevel,
          hours_per_week: hoursPerWeek,
          deadline: new Date(Date.now() + deadlineWeeks * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          feasibility_status: analysisResult.feasibilityStatus,
          estimated_hours: analysisResult.requiredHours,
          available_hours: analysisResult.effectiveAvailableHours,
          hour_gap: analysisResult.requiredHours - analysisResult.effectiveAvailableHours,
          recommendations: analysisResult.howToAchieve.topPriorityAreas as string[],
          field,
          quiz_results: quiz ? JSON.parse(JSON.stringify(quiz)) : null,
          achievement_plan: JSON.parse(JSON.stringify(analysisResult)),
          calibrated_skill_level: quiz?.calibratedLevel || null,
        })
        .select()
        .single();

      if (saveError) {
        console.error("Save error:", saveError);
      } else {
        setSavedGoalId(savedGoal.id);
      }

      setStep("result");
      toast({ title: "Analysis complete" });
    } catch (err) {
      console.error("Analysis error:", err);
      toast({ title: "Analysis failed", description: "Please try again", variant: "destructive" });
      setStep("input");
    }
  };

  const handleDecompose = () => {
    if (savedGoalId) {
      navigate(`/problem-decomposer?goalId=${savedGoalId}&goal=${encodeURIComponent(goal)}`);
    } else {
      navigate(`/problem-decomposer?goal=${encodeURIComponent(goal)}`);
    }
  };

  const handleTryAnother = () => {
    setStep("input");
    setGoal("");
    setResult(null);
    setQuizResults(null);
    setSavedGoalId(null);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setTimeout(() => {
      toast({ title: "Blueprint download coming soon!" });
      setIsDownloading(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="container max-w-3xl py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Target className="h-4 w-4" />
            Career Reality Check
          </div>
          <h1 className="text-3xl font-bold">Achievement Planner</h1>
          <p className="text-muted-foreground">
            Get an honest, data-driven analysis of your career goals
          </p>
          {user && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Coins className="w-4 h-4" />
                Your tokens: {tokens}
              </div>
              <TokenDisplay tokens={TOKEN_COST} size="sm" />
            </div>
          )}
        </div>

        {/* Step: Input Form */}
        {step === "input" && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Define Your Goal
              </CardTitle>
              <CardDescription>
                Tell us about your career goal and we'll analyze its feasibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Goal Input */}
              <div className="space-y-2">
                <Label htmlFor="goal">Target Goal or Position</Label>
                <Input
                  id="goal"
                  placeholder="e.g., Become a Full-Stack Developer, Clear UPSC, Launch a startup..."
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="text-base"
                />
              </div>

              {/* Field Selection */}
              <div className="space-y-2">
                <Label>Field</Label>
                <Select value={field} onValueChange={setField}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELDS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Skill Level */}
              <div className="space-y-2">
                <Label>Current Skill Level (Self-Assessment)</Label>
                <Select value={skillLevel} onValueChange={setSkillLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_LEVELS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Hours per Week */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Available Hours per Week</Label>
                  <span className="text-sm font-medium text-primary">{hoursPerWeek} hours</span>
                </div>
                <Slider
                  value={[hoursPerWeek]}
                  onValueChange={([v]) => setHoursPerWeek(v)}
                  min={5}
                  max={60}
                  step={5}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5 hrs</span>
                  <span>60 hrs</span>
                </div>
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <Label>Target Timeline</Label>
                <div className="flex gap-3">
                  <Input
                    type="number"
                    min={1}
                    max={deadlineUnit === "months" ? 36 : 52}
                    value={deadlineValue}
                    onChange={(e) => setDeadlineValue(parseInt(e.target.value) || 1)}
                    className="w-24"
                  />
                  <Select value={deadlineUnit} onValueChange={(v: "weeks" | "months") => setDeadlineUnit(v)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weeks">Weeks</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">
                  ≈ {deadlineWeeks} weeks total ({Math.round(hoursPerWeek * deadlineWeeks)} hours available)
                </p>
              </div>

              <Button onClick={handleStartQuiz} className="w-full" size="lg" disabled={!goal.trim()}>
                <Brain className="h-4 w-4 mr-2" />
                Continue to Skill Quiz
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Next: A short quiz to calibrate your actual skill level for more accurate analysis
              </p>
            </CardContent>
          </Card>
        )}

        {/* Step: Adaptive Quiz */}
        {step === "quiz" && (
          <AdaptiveQuiz field={field} onComplete={handleQuizComplete} onSkip={handleSkipQuiz} />
        )}

        {/* Step: Analyzing */}
        {step === "analyzing" && (
          <Card className="border-primary/20">
            <CardContent className="py-16 text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">Analyzing Your Goal</h3>
                <p className="text-sm text-muted-foreground">
                  Calculating feasibility with conservative estimates...
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step: Results */}
        {step === "result" && result && (
          <AchievementPlan
            data={result}
            onDecompose={handleDecompose}
            onTryAnother={handleTryAnother}
            onDownload={handleDownload}
            isDownloading={isDownloading}
          />
        )}
      </div>
    </Layout>
  );
}
