import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TokenDisplay } from "@/components/shared/TokenDisplay";
import { Target, Zap, Clock, AlertTriangle, TrendingUp, Coins } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTokens } from "@/hooks/useTokens";
import { toast } from "@/hooks/use-toast";

interface CheckResult {
  status: "realistic" | "risky" | "unrealistic";
  requiredHours: number;
  availableHours: number;
  gap: number;
  gapExplanation: string;
  recommendations: string[];
}

const TOKEN_COST = 1;

export default function RealityCheck() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tokens, spendTokens, canAfford } = useTokens();
  
  const [goal, setGoal] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [deadlineValue, setDeadlineValue] = useState("");
  const [deadlineUnit, setDeadlineUnit] = useState<"weeks" | "months">("months");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedGoalId, setSavedGoalId] = useState<string | null>(null);

  const getDeadlineWeeks = () => {
    const value = parseInt(deadlineValue) || 1;
    return deadlineUnit === "months" ? value * 4 : value;
  };

  const getDeadlineDate = () => {
    const weeks = getDeadlineWeeks();
    const date = new Date();
    date.setDate(date.getDate() + weeks * 7);
    return date.toISOString().split("T")[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to use this feature",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!canAfford(TOKEN_COST)) {
      toast({
        title: "Insufficient Tokens",
        description: `You need ${TOKEN_COST} token to use this feature. You have ${tokens} tokens.`,
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      // Call the AI edge function
      const { data, error } = await supabase.functions.invoke("analyze-goal", {
        body: {
          type: "reality-check",
          goal,
          skillLevel,
          hoursPerWeek: parseInt(hoursPerWeek) || 10,
          deadlineWeeks: getDeadlineWeeks(),
        },
      });

      if (error) throw error;

      const aiResult = data.result as CheckResult;
      setResult(aiResult);

      // Spend tokens
      await spendTokens.mutateAsync({
        amount: TOKEN_COST,
        feature: "reality-check",
        description: `Reality check for: ${goal.substring(0, 50)}...`,
      });

      // Save goal to database
      const { data: goalData, error: goalError } = await supabase
        .from("goals")
        .insert({
          user_id: user.id,
          title: goal,
          skill_level: skillLevel,
          hours_per_week: parseInt(hoursPerWeek) || 10,
          deadline: getDeadlineDate(),
          estimated_hours: aiResult.requiredHours,
          available_hours: aiResult.availableHours,
          hour_gap: aiResult.gap,
          feasibility_status: aiResult.status === "risky" ? "risky" : aiResult.status,
          recommendations: aiResult.recommendations,
          is_active: aiResult.status === "realistic",
        })
        .select()
        .single();

      if (goalError) {
        console.error("Error saving goal:", goalError);
      } else {
        setSavedGoalId(goalData.id);
      }

      toast({
        title: "Analysis Complete",
        description: `Goal marked as ${aiResult.status}. ${TOKEN_COST} token spent.`,
      });

    } catch (error) {
      console.error("Reality check error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze goal",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDecompose = () => {
    if (savedGoalId) {
      navigate(`/problem-decomposer?goalId=${savedGoalId}&goal=${encodeURIComponent(goal)}`);
    } else {
      navigate(`/problem-decomposer?goal=${encodeURIComponent(goal)}`);
    }
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Career Reality Check</span>
              <TokenDisplay tokens={TOKEN_COST} size="sm" className="ml-2" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Is Your Goal <span className="gradient-text">Actually Achievable?</span>
            </h1>
            <p className="text-muted-foreground">
              Enter your goal and constraints. We'll tell you if you're being realistic or delusional.
            </p>
            {user && (
              <div className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Coins className="w-4 h-4" />
                Your tokens: {tokens}
              </div>
            )}
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-xl card-gradient border border-border mb-8">
              <div className="space-y-2">
                <Label htmlFor="goal">What's your goal?</Label>
                <Textarea
                  id="goal"
                  placeholder="e.g., Become a Backend Engineer, Land a Data Science internship, Learn Machine Learning..."
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="min-h-[80px] bg-secondary/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skill-level">Current Skill Level</Label>
                <Select value={skillLevel} onValueChange={setSkillLevel} required>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder="Select your current level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete-beginner">Complete Beginner (no coding experience)</SelectItem>
                    <SelectItem value="beginner">Beginner (some basics, no projects)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (few projects, learning)</SelectItem>
                    <SelectItem value="advanced">Advanced (working knowledge, needs depth)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours">Hours per Week</Label>
                <Input
                  id="hours"
                  type="number"
                  placeholder="e.g., 15"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(e.target.value)}
                  className="bg-secondary/50"
                  min="1"
                  max="60"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Target Deadline</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="e.g., 6"
                    value={deadlineValue}
                    onChange={(e) => setDeadlineValue(e.target.value)}
                    className="bg-secondary/50"
                    min="1"
                    max="52"
                    required
                  />
                  <Select value={deadlineUnit} onValueChange={(v) => setDeadlineUnit(v as "weeks" | "months")}>
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weeks">Weeks</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">
                  {deadlineValue && `≈ ${getDeadlineWeeks()} weeks total`}
                </p>
              </div>

              <Button 
                type="submit" 
                variant="hero" 
                className="w-full" 
                disabled={isAnalyzing || !skillLevel}
              >
                {isAnalyzing ? (
                  <>
                    <Zap className="w-4 h-4 animate-pulse" />
                    Analyzing Reality...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4" />
                    Check My Reality ({TOKEN_COST} token)
                  </>
                )}
              </Button>
            </form>

            {/* Result */}
            {result && (
              <div className="animate-slide-up space-y-6">
                <div className="p-8 rounded-xl card-gradient border border-border">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Feasibility Analysis</h2>
                    <StatusBadge status={result.status} />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-secondary/50 text-center">
                      <Clock className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                      <div className="text-2xl font-bold">{result.requiredHours}</div>
                      <div className="text-xs text-muted-foreground">Hours Required</div>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/50 text-center">
                      <TrendingUp className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                      <div className="text-2xl font-bold">{result.availableHours}</div>
                      <div className="text-xs text-muted-foreground">Hours Available</div>
                    </div>
                    <div className={`p-4 rounded-lg text-center ${result.gap >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
                      <AlertTriangle className={`w-5 h-5 mx-auto mb-2 ${result.gap >= 0 ? 'text-success' : 'text-destructive'}`} />
                      <div className={`text-2xl font-bold ${result.gap >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {result.gap > 0 ? '+' : ''}{result.gap}
                      </div>
                      <div className="text-xs text-muted-foreground">Hour Gap</div>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="p-4 rounded-lg bg-secondary/30 mb-6">
                    <h3 className="font-semibold mb-2">Gap Analysis</h3>
                    <p className="text-sm text-muted-foreground">{result.gapExplanation}</p>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h3 className="font-semibold mb-3">Recommended Adjustments</h3>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary mt-0.5">→</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1" onClick={() => {
                    setResult(null);
                    setSavedGoalId(null);
                  }}>
                    Try Another Goal
                  </Button>
                  {result.status !== "unrealistic" && (
                    <Button variant="hero" className="flex-1" onClick={handleDecompose}>
                      Decompose This Goal
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
