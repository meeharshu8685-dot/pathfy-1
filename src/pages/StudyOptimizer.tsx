import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TokenDisplay } from "@/components/shared/TokenDisplay";
import { GoalSelector } from "@/components/shared/GoalSelector";
import {
  Clock,
  Zap,
  Brain,
  AlertTriangle,
  CheckCircle2,
  Coins,
  Battery,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  Coffee,
  Heart,
  RotateCcw
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTokens } from "@/hooks/useTokens";
import { useGoals } from "@/hooks/useGoals";
import { toast } from "@/hooks/use-toast";

interface TodayTask {
  id: string;
  title: string;
  estimatedMinutes: number;
  priority: "critical" | "high" | "medium" | "light";
  reason: string;
  difficulty: "easy" | "moderate" | "challenging";
}

interface OptimizerResult {
  tasks: TodayTask[];
  focusWarning?: string;
  totalTime: number;
  mentorNote?: string;
  suggestRest?: boolean;
}

const TOKEN_COST = 0; // Free feature

export default function StudyOptimizer() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tokens, spendTokens, canAfford } = useTokens();
  const { goals } = useGoals();

  const [availableTime, setAvailableTime] = useState("");
  const [energyLevel, setEnergyLevel] = useState([50]);
  const [result, setResult] = useState<OptimizerResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [consistencyDays, setConsistencyDays] = useState<number>(0);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  // Goals with completed reality check
  const completedGoals = goals.filter(g => g.feasibility_status && g.achievement_plan);

  // Get active goal - use selected goal or find first active
  const activeGoal = selectedGoalId
    ? goals.find(g => g.id === selectedGoalId)
    : goals.find(g => g.is_active && g.feasibility_status) || completedGoals[0];

  // Set initial selected goal
  useEffect(() => {
    if (!selectedGoalId && activeGoal) {
      setSelectedGoalId(activeGoal.id);
    }
  }, [activeGoal, selectedGoalId]);

  // Fetch consistency history
  useEffect(() => {
    const fetchConsistency = async () => {
      if (!user) return;

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data } = await supabase
        .from("daily_plans")
        .select("plan_date, completed_minutes")
        .eq("user_id", user.id)
        .gte("plan_date", sevenDaysAgo.toISOString().split("T")[0])
        .order("plan_date", { ascending: false });

      if (data) {
        const activeDays = data.filter(d => d.completed_minutes > 0).length;
        setConsistencyDays(activeDays);
      }
    };

    fetchConsistency();
  }, [user]);

  const getConsistencyNote = () => {
    if (consistencyDays === 0) return "Starting fresh - let's begin with something small";
    if (consistencyDays <= 2) return `${consistencyDays} day(s) active recently - rebuilding momentum`;
    if (consistencyDays <= 4) return `${consistencyDays} days active this week - good consistency`;
    return `${consistencyDays} days active this week - excellent momentum`;
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

    // Daily Optimizer is free - no token check needed

    setIsOptimizing(true);
    setResult(null);

    try {
      // Fetch user's pending tasks from roadmaps
      const { data: roadmapTasks } = await supabase
        .from("roadmap_steps")
        .select("title, estimated_hours, status, order_index")
        .eq("user_id", user.id)
        .in("status", ["unlocked", "in_progress"])
        .order("order_index", { ascending: true })
        .limit(5);

      // Also fetch decomposed tasks
      const { data: decomposedTasks } = await supabase
        .from("tasks")
        .select("title, estimated_hours, status, phase_number")
        .eq("user_id", user.id)
        .in("status", ["unlocked", "in_progress"])
        .order("phase_number", { ascending: true })
        .limit(5);

      const allTasks = [
        ...(roadmapTasks || []).map(t => ({ ...t, source: "roadmap" })),
        ...(decomposedTasks || []).map(t => ({ ...t, source: "decomposed" }))
      ];

      const { data, error } = await supabase.functions.invoke("analyze-goal", {
        body: {
          type: "optimize",
          goal: activeGoal?.title || "Daily study session",
          availableMinutes: parseInt(availableTime) || 60,
          focusLevel: energyLevel[0],
          existingTasks: allTasks,
          consistencyNote: getConsistencyNote(),
        },
      });

      if (error) throw error;

      const aiResult = data.result as OptimizerResult;
      setResult(aiResult);

      // Daily Optimizer is free - no token spending

      // Save daily plan
      const today = new Date().toISOString().split("T")[0];

      // Check if plan exists for today
      const { data: existingPlan } = await supabase
        .from("daily_plans")
        .select("id")
        .eq("user_id", user.id)
        .eq("plan_date", today)
        .single();

      if (existingPlan) {
        await supabase
          .from("daily_plans")
          .update({
            available_minutes: parseInt(availableTime) || 60,
            focus_level: getEnergyLabel(energyLevel[0]),
            focus_warning: aiResult.focusWarning || null,
            selected_tasks: aiResult.tasks as unknown as import("@/integrations/supabase/types").Json,
            total_planned_minutes: aiResult.totalTime,
          })
          .eq("id", existingPlan.id);
      } else {
        await supabase.from("daily_plans").insert({
          user_id: user.id,
          plan_date: today,
          available_minutes: parseInt(availableTime) || 60,
          focus_level: getEnergyLabel(energyLevel[0]),
          focus_warning: aiResult.focusWarning || null,
          selected_tasks: aiResult.tasks as unknown as import("@/integrations/supabase/types").Json,
          total_planned_minutes: aiResult.totalTime,
        });
      }

      toast({
        title: aiResult.suggestRest ? "Rest Day Suggested" : "Today's Plan Ready",
        description: aiResult.suggestRest
          ? "Taking a break is part of progress."
          : `${aiResult.tasks.length} task(s) for ${aiResult.totalTime} minutes.`,
      });

    } catch (error) {
      console.error("Optimization error:", error);
      toast({
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : "Failed to optimize",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const getEnergyLabel = (value: number) => {
    if (value < 30) return "low";
    if (value < 60) return "medium";
    return "high";
  };

  const getEnergyDescription = (value: number) => {
    if (value < 30) return "Low (tired/drained)";
    if (value < 60) return "Medium (okay)";
    return "High (focused/energized)";
  };

  const getEnergyIcon = (value: number) => {
    if (value < 30) return <BatteryLow className="w-4 h-4 text-destructive" />;
    if (value < 60) return <BatteryMedium className="w-4 h-4 text-amber-500" />;
    return <BatteryFull className="w-4 h-4 text-success" />;
  };

  const getPriorityColor = (priority: TodayTask["priority"]) => {
    switch (priority) {
      case "critical":
        return "text-destructive bg-destructive/10 border-destructive/30";
      case "high":
        return "text-amber-500 bg-amber-500/10 border-amber-500/30";
      case "medium":
        return "text-primary bg-primary/10 border-primary/30";
      case "light":
        return "text-muted-foreground bg-secondary border-border";
    }
  };

  const getDifficultyBadge = (difficulty: TodayTask["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">Easy</span>;
      case "moderate":
        return <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">Moderate</span>;
      case "challenging":
        return <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">Challenging</span>;
    }
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Daily Optimizer</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/30 ml-2">Free</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              What Should You Do <span className="gradient-text">Today?</span>
            </h1>
            <p className="text-muted-foreground">
              Tell us your time and energy. We'll decide what to execute right now.
            </p>
            {user && (
              <div className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Coins className="w-4 h-4" />
                Your tokens: {tokens}
              </div>
            )}
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Goal Selector */}
            {completedGoals.length > 1 && (
              <div className="mb-6">
                <GoalSelector
                  goals={goals}
                  selectedGoalId={selectedGoalId}
                  onSelectGoal={(goalId) => {
                    setSelectedGoalId(goalId);
                    setResult(null);
                  }}
                  filterCompleted={true}
                />
              </div>
            )}

            {/* Context Info */}
            {activeGoal && (
              <div className="p-4 rounded-lg bg-secondary/50 border border-border mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Working towards:</span>
                  <span className="font-medium">{activeGoal.title}</span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>{getConsistencyNote()}</span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8 p-8 rounded-xl card-gradient border border-border mb-8">
              <div className="space-y-2">
                <Label htmlFor="time">How much time do you have today? (minutes)</Label>
                <Input
                  id="time"
                  type="number"
                  placeholder="e.g., 60"
                  value={availableTime}
                  onChange={(e) => setAvailableTime(e.target.value)}
                  className="bg-secondary/50"
                  min="10"
                  max="480"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Be honest. It's okay if it's less than usual.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Battery className="w-4 h-4" />
                    Current Energy Level
                  </Label>
                  <span className="text-sm font-mono flex items-center gap-2">
                    {getEnergyIcon(energyLevel[0])}
                    {getEnergyDescription(energyLevel[0])}
                  </span>
                </div>
                <Slider
                  value={energyLevel}
                  onValueChange={setEnergyLevel}
                  max={100}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Brain className="w-3 h-3" /> Tired
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Energized
                  </span>
                </div>
              </div>

              <Button type="submit" variant="hero" className="w-full" disabled={isOptimizing}>
                {isOptimizing ? (
                  <>
                    <Zap className="w-4 h-4 animate-pulse" />
                    Deciding...
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    What Should I Do Today?
                  </>
                )}
              </Button>
            </form>

            {/* Result */}
            {result && (
              <div className="animate-slide-up space-y-6">
                {/* Rest Suggestion */}
                {result.suggestRest ? (
                  <div className="p-8 rounded-xl card-gradient border border-border">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                        <Coffee className="w-8 h-8 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Take a Break Today</h2>
                      <p className="text-muted-foreground mb-6">
                        Rest is part of progress. Your energy is low, and pushing through won't help.
                      </p>

                      {result.mentorNote && (
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/30 text-left">
                          <div className="flex items-center gap-2 mb-2">
                            <Heart className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">A Note</span>
                          </div>
                          <p className="text-sm text-muted-foreground italic">
                            "{result.mentorNote}"
                          </p>
                        </div>
                      )}

                      {result.tasks.length > 0 && (
                        <div className="mt-6 text-left">
                          <p className="text-sm text-muted-foreground mb-3">
                            If you want to do something light:
                          </p>
                          {result.tasks.map((task, index) => (
                            <div key={task.id} className="p-3 rounded-lg bg-secondary/30 border border-border mb-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">{task.title}</span>
                                <span className="text-xs text-muted-foreground">{task.estimatedMinutes}m</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-xl card-gradient border border-border">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold">Today's Focus</h2>
                      <span className="text-sm text-muted-foreground">
                        {result.totalTime} min total
                      </span>
                    </div>

                    {result.focusWarning && (
                      <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-6 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">{result.focusWarning}</p>
                      </div>
                    )}

                    <div className="space-y-4">
                      {result.tasks.map((task, index) => (
                        <div
                          key={task.id}
                          className="p-4 rounded-lg bg-secondary/50 border border-border"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                                {getDifficultyBadge(task.difficulty)}
                                <span className="text-xs font-mono text-muted-foreground">
                                  {task.estimatedMinutes}m
                                </span>
                              </div>
                              <h3 className="font-medium mb-2">{task.title}</h3>
                              <p className="text-sm text-muted-foreground">{task.reason}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Mentor Note */}
                    {result.mentorNote && (
                      <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-primary">Today's Note</span>
                        </div>
                        <p className="text-sm text-muted-foreground italic">
                          "{result.mentorNote}"
                        </p>
                      </div>
                    )}

                    <div className="mt-6 p-4 rounded-lg bg-success/10 border border-success/30 flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        Complete these {result.tasks.length} task{result.tasks.length > 1 ? "s" : ""} to stay on track. That's all for today.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 gap-2" onClick={() => setResult(null)}>
                    <RotateCcw className="w-4 h-4" />
                    Re-optimize
                  </Button>
                  <Button variant="hero" className="flex-1" asChild>
                    <a href="/dashboard">View Dashboard</a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
