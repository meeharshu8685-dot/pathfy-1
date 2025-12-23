import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TokenDisplay } from "@/components/shared/TokenDisplay";
import { Clock, Zap, Brain, AlertTriangle, CheckCircle2, Coins } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTokens } from "@/hooks/useTokens";
import { toast } from "@/hooks/use-toast";

interface TodayTask {
  id: string;
  title: string;
  estimatedMinutes: number;
  priority: "critical" | "high" | "medium";
  reason: string;
}

interface OptimizerResult {
  tasks: TodayTask[];
  focusWarning?: string;
  totalTime: number;
}

const TOKEN_COST = 1;

export default function StudyOptimizer() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tokens, spendTokens, canAfford } = useTokens();

  const [availableTime, setAvailableTime] = useState("");
  const [focusLevel, setFocusLevel] = useState([50]);
  const [result, setResult] = useState<OptimizerResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

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
        description: `You need ${TOKEN_COST} token. You have ${tokens} tokens.`,
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    setResult(null);

    try {
      // Fetch user's pending tasks from roadmaps
      const { data: pendingTasks } = await supabase
        .from("roadmap_steps")
        .select("title, estimated_hours, status")
        .eq("user_id", user.id)
        .in("status", ["unlocked", "in_progress"])
        .limit(10);

      const { data, error } = await supabase.functions.invoke("analyze-goal", {
        body: {
          type: "optimize",
          goal: "Daily study session",
          availableMinutes: parseInt(availableTime) || 60,
          focusLevel: focusLevel[0],
          existingTasks: pendingTasks || [],
        },
      });

      if (error) throw error;

      const aiResult = data.result as OptimizerResult;
      setResult(aiResult);

      await spendTokens.mutateAsync({
        amount: TOKEN_COST,
        feature: "optimize",
        description: `Optimized ${availableTime} min session`,
      });

      // Save daily plan
      const today = new Date().toISOString().split("T")[0];
      await supabase.from("daily_plans").insert({
        user_id: user.id,
        plan_date: today,
        available_minutes: parseInt(availableTime) || 60,
        focus_level: getFocusLabel(focusLevel[0]),
        focus_warning: aiResult.focusWarning || null,
        selected_tasks: aiResult.tasks as unknown as import("@/integrations/supabase/types").Json,
        total_planned_minutes: aiResult.totalTime,
      });

      toast({
        title: "Optimization Complete",
        description: `${aiResult.tasks.length} tasks for ${aiResult.totalTime} minutes.`,
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

  const getFocusLabel = (value: number) => {
    if (value < 30) return "low";
    if (value < 70) return "medium";
    return "high";
  };

  const getFocusDescription = (value: number) => {
    if (value < 30) return "Low (tired/distracted)";
    if (value < 70) return "Medium (normal)";
    return "High (sharp/focused)";
  };

  const getPriorityColor = (priority: TodayTask["priority"]) => {
    switch (priority) {
      case "critical":
        return "text-destructive";
      case "high":
        return "text-warning";
      case "medium":
        return "text-muted-foreground";
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
              <span className="text-sm font-medium">Study Time Optimizer</span>
              <TokenDisplay tokens={TOKEN_COST} size="sm" className="ml-2" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              What Should You Do <span className="gradient-text">Right Now?</span>
            </h1>
            <p className="text-muted-foreground">
              Tell us your time and focus. We'll tell you exactly what to execute.
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
            <form onSubmit={handleSubmit} className="space-y-8 p-8 rounded-xl card-gradient border border-border mb-8">
              <div className="space-y-2">
                <Label htmlFor="time">Available Time Today (minutes)</Label>
                <Input
                  id="time"
                  type="number"
                  placeholder="e.g., 90"
                  value={availableTime}
                  onChange={(e) => setAvailableTime(e.target.value)}
                  className="bg-secondary/50"
                  min="15"
                  max="480"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Be honest. Account for breaks and interruptions.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Current Focus Level</Label>
                  <span className="text-sm font-mono text-primary">
                    {getFocusDescription(focusLevel[0])}
                  </span>
                </div>
                <Slider
                  value={focusLevel}
                  onValueChange={setFocusLevel}
                  max={100}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Brain className="w-3 h-3" /> Exhausted
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Laser Focused
                  </span>
                </div>
              </div>

              <Button type="submit" variant="hero" className="w-full" disabled={isOptimizing}>
                {isOptimizing ? (
                  <>
                    <Zap className="w-4 h-4 animate-pulse" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    Optimize My Time ({TOKEN_COST} token)
                  </>
                )}
              </Button>
            </form>

            {/* Result */}
            {result && (
              <div className="animate-slide-up space-y-6">
                <div className="p-8 rounded-xl card-gradient border border-border">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Today's Focus</h2>
                    <span className="text-sm text-muted-foreground">
                      {result.totalTime} min planned
                    </span>
                  </div>

                  {result.focusWarning && (
                    <div className="p-4 rounded-lg bg-warning/10 border border-warning/30 mb-6 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-warning">{result.focusWarning}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {result.tasks.map((task, index) => (
                      <div
                        key={task.id}
                        className="p-4 rounded-lg bg-secondary/50 border border-border"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-semibold uppercase ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
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

                  <div className="mt-6 p-4 rounded-lg bg-success/10 border border-success/30 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <p className="text-sm text-success">
                      Complete these {result.tasks.length} tasks to stay on track with your roadmap.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1" onClick={() => setResult(null)}>
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
