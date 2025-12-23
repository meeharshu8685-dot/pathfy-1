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
  { value: "medical", label: "Medical & Healthcare" },
  { value: "exams", label: "Competitive Exams" },
  { value: "business", label: "Business & Management" },
  { value: "sports", label: "Sports & Fitness" },
  { value: "arts", label: "Arts & Creative" },
  { value: "govt", label: "Government Jobs" },
  { value: "other", label: "Other" },
];

const FIELD_GOALS: Record<string, { value: string; label: string }[]> = {
  tech: [
    { value: "frontend-developer", label: "Frontend Developer" },
    { value: "backend-developer", label: "Backend Developer" },
    { value: "fullstack-developer", label: "Full-Stack Developer" },
    { value: "mobile-developer", label: "Mobile App Developer" },
    { value: "data-scientist", label: "Data Scientist" },
    { value: "ml-engineer", label: "Machine Learning Engineer" },
    { value: "devops-engineer", label: "DevOps Engineer" },
    { value: "cloud-architect", label: "Cloud Architect" },
    { value: "cybersecurity-analyst", label: "Cybersecurity Analyst" },
    { value: "ui-ux-designer", label: "UI/UX Designer" },
  ],
  medical: [
    { value: "mbbs", label: "MBBS Doctor" },
    { value: "neet-ug", label: "NEET UG Qualification" },
    { value: "neet-pg", label: "NEET PG Qualification" },
    { value: "aiims", label: "AIIMS Admission" },
    { value: "nursing", label: "Registered Nurse" },
    { value: "pharmacist", label: "Pharmacist" },
    { value: "physiotherapist", label: "Physiotherapist" },
    { value: "dentist", label: "Dentist (BDS)" },
    { value: "medical-researcher", label: "Medical Researcher" },
    { value: "hospital-admin", label: "Hospital Administrator" },
  ],
  exams: [
    { value: "upsc-cse", label: "UPSC Civil Services (IAS/IPS)" },
    { value: "ssc-cgl", label: "SSC CGL" },
    { value: "bank-po", label: "Bank PO (IBPS/SBI)" },
    { value: "cat-mba", label: "CAT for MBA" },
    { value: "gate", label: "GATE Engineering" },
    { value: "gre", label: "GRE for Masters" },
    { value: "gmat", label: "GMAT for MBA" },
    { value: "jee-main", label: "JEE Main" },
    { value: "jee-advanced", label: "JEE Advanced (IIT)" },
    { value: "clat", label: "CLAT (Law)" },
    { value: "nda", label: "NDA Exam" },
    { value: "cds", label: "CDS Exam" },
  ],
  business: [
    { value: "startup-founder", label: "Startup Founder" },
    { value: "product-manager", label: "Product Manager" },
    { value: "business-analyst", label: "Business Analyst" },
    { value: "marketing-manager", label: "Marketing Manager" },
    { value: "sales-manager", label: "Sales Manager" },
    { value: "consultant", label: "Management Consultant" },
    { value: "entrepreneur", label: "Entrepreneur" },
    { value: "finance-analyst", label: "Financial Analyst" },
  ],
  sports: [
    { value: "professional-athlete", label: "Professional Athlete" },
    { value: "fitness-trainer", label: "Certified Fitness Trainer" },
    { value: "sports-coach", label: "Sports Coach" },
    { value: "yoga-instructor", label: "Yoga Instructor" },
    { value: "nutritionist", label: "Sports Nutritionist" },
  ],
  arts: [
    { value: "graphic-designer", label: "Graphic Designer" },
    { value: "video-editor", label: "Video Editor" },
    { value: "content-creator", label: "Content Creator" },
    { value: "photographer", label: "Professional Photographer" },
    { value: "animator", label: "Animator" },
    { value: "music-producer", label: "Music Producer" },
    { value: "writer", label: "Professional Writer" },
  ],
  govt: [
    { value: "ias-ips", label: "IAS/IPS Officer" },
    { value: "state-psc", label: "State PSC Officer" },
    { value: "railway", label: "Railway Jobs" },
    { value: "defence", label: "Defence Services" },
    { value: "teaching", label: "Government Teacher" },
    { value: "psu", label: "PSU Jobs" },
  ],
  other: [],
};

const SKILL_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

type Step = "input" | "quiz" | "analyzing" | "result";
type GoalInputMode = "select" | "manual";

const TOKEN_COST = 1;

export default function RealityCheck() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tokens, spendTokens, canAfford } = useTokens();

  const [step, setStep] = useState<Step>("input");
  const [goal, setGoal] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [goalInputMode, setGoalInputMode] = useState<GoalInputMode>("select");
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
  
  // Get the actual goal text
  const getGoalText = () => {
    if (goalInputMode === "manual") return goal;
    const fieldGoals = FIELD_GOALS[field] || [];
    const selectedOption = fieldGoals.find(g => g.value === selectedGoal);
    return selectedOption?.label || selectedGoal || goal;
  };

  // Reset selected goal when field changes
  const handleFieldChange = (newField: string) => {
    setField(newField);
    setSelectedGoal("");
  };

  const handleStartQuiz = () => {
    const goalText = getGoalText();
    if (!goalText.trim()) {
      toast({ title: "Please enter or select a goal", variant: "destructive" });
      return;
    }
    setStep("quiz");
  };

  const handleContinueWithoutQuiz = () => {
    const goalText = getGoalText();
    if (!goalText.trim()) {
      toast({ title: "Please enter or select a goal", variant: "destructive" });
      return;
    }
    runAnalysis(null);
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

    const goalText = getGoalText();
    setStep("analyzing");

    try {
      const { data, error } = await supabase.functions.invoke("analyze-goal", {
        body: {
          type: "reality-check-v2",
          goal: goalText,
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
          title: goalText,
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
    const goalText = getGoalText();
    if (savedGoalId) {
      navigate(`/problem-decomposer?goalId=${savedGoalId}&goal=${encodeURIComponent(goalText)}`);
    } else {
      navigate(`/problem-decomposer?goal=${encodeURIComponent(goalText)}`);
    }
  };

  const handleTryAnother = () => {
    setStep("input");
    setGoal("");
    setSelectedGoal("");
    setGoalInputMode("select");
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
              {/* Field Selection - First */}
              <div className="space-y-2">
                <Label>Field</Label>
                <Select value={field} onValueChange={handleFieldChange}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border z-50">
                    {FIELDS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Goal Input - Two Sections */}
              <div className="space-y-4">
                <Label>Target Goal or Position</Label>
                
                {/* Toggle between modes */}
                <div className="flex gap-2 p-1 rounded-lg bg-secondary/50">
                  <Button
                    type="button"
                    variant={goalInputMode === "select" ? "default" : "ghost"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setGoalInputMode("select")}
                  >
                    Choose from list
                  </Button>
                  <Button
                    type="button"
                    variant={goalInputMode === "manual" ? "default" : "ghost"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setGoalInputMode("manual")}
                  >
                    Write manually
                  </Button>
                </div>

                {/* Select Mode */}
                {goalInputMode === "select" && (
                  <div className="space-y-2">
                    {FIELD_GOALS[field]?.length > 0 ? (
                      <Select value={selectedGoal} onValueChange={setSelectedGoal}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select a goal/position..." />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border border-border z-50 max-h-[300px]">
                          {FIELD_GOALS[field].map((g) => (
                            <SelectItem key={g.value} value={g.value}>
                              {g.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-4 rounded-lg bg-secondary/50 border border-border text-center">
                        <p className="text-sm text-muted-foreground">
                          No preset goals for this field. Please write your goal manually.
                        </p>
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          onClick={() => setGoalInputMode("manual")}
                          className="mt-2"
                        >
                          Switch to manual input
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Manual Mode */}
                {goalInputMode === "manual" && (
                  <Input
                    id="goal"
                    placeholder="e.g., Become a Full-Stack Developer, Clear UPSC, Launch a startup..."
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="text-base bg-background"
                  />
                )}
              </div>

              {/* Skill Level */}
              <div className="space-y-2">
                <Label>Current Skill Level (Self-Assessment)</Label>
                <Select value={skillLevel} onValueChange={setSkillLevel}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border z-50">
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
                    className="w-24 bg-background"
                  />
                  <Select value={deadlineUnit} onValueChange={(v: "weeks" | "months") => setDeadlineUnit(v)}>
                    <SelectTrigger className="w-32 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border z-50">
                      <SelectItem value="weeks">Weeks</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">
                  ≈ {deadlineWeeks} weeks total ({Math.round(hoursPerWeek * deadlineWeeks)} hours available)
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleStartQuiz} 
                  className="w-full" 
                  size="lg" 
                  disabled={goalInputMode === "select" ? !selectedGoal : !goal.trim()}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Continue to Skill Quiz
                </Button>

                <Button 
                  onClick={handleContinueWithoutQuiz} 
                  variant="outline"
                  className="w-full" 
                  size="lg"
                  disabled={goalInputMode === "select" ? !selectedGoal : !goal.trim()}
                >
                  Continue without Skill Quiz
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                The skill quiz helps calibrate your actual level for more accurate analysis
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
