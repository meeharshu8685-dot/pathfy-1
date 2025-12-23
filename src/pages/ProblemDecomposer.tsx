import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TokenDisplay } from "@/components/shared/TokenDisplay";
import { Puzzle, Zap, ChevronDown, ChevronRight, Clock, Coins } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTokens } from "@/hooks/useTokens";
import { toast } from "@/hooks/use-toast";

interface MicroTask {
  id: string;
  title: string;
  estimatedMinutes: number;
}

interface Task {
  id: string;
  title: string;
  microTasks: MicroTask[];
}

interface Phase {
  id: string;
  name: string;
  tasks: Task[];
}

const TOKEN_COST = 1;

export default function ProblemDecomposer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { tokens, spendTokens, canAfford } = useTokens();

  const [goal, setGoal] = useState("");
  const [goalId, setGoalId] = useState<string | null>(null);
  const [phases, setPhases] = useState<Phase[] | null>(null);
  const [isDecomposing, setIsDecomposing] = useState(false);
  const [expandedPhases, setExpandedPhases] = useState<string[]>([]);
  const [expandedTasks, setExpandedTasks] = useState<string[]>([]);

  useEffect(() => {
    const goalParam = searchParams.get("goal");
    const goalIdParam = searchParams.get("goalId");
    if (goalParam) setGoal(goalParam);
    if (goalIdParam) setGoalId(goalIdParam);
  }, [searchParams]);

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

    setIsDecomposing(true);
    setPhases(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-goal", {
        body: {
          type: "decompose",
          goal,
        },
      });

      if (error) throw error;

      const aiPhases = data.result as Phase[];
      setPhases(aiPhases);
      setExpandedPhases([aiPhases[0]?.id || "1"]);

      await spendTokens.mutateAsync({
        amount: TOKEN_COST,
        feature: "decompose",
        description: `Decomposed: ${goal.substring(0, 50)}...`,
      });

      // If we have a goalId, save tasks to database
      if (goalId) {
        let phaseNumber = 1;
        let orderIndex = 0;

        for (const phase of aiPhases) {
          for (const task of phase.tasks) {
            const totalMinutes = task.microTasks.reduce((sum, mt) => sum + mt.estimatedMinutes, 0);
            
            const { data: taskData, error: taskError } = await supabase
              .from("tasks")
              .insert({
                user_id: user.id,
                goal_id: goalId,
                title: task.title,
                phase_number: phaseNumber,
                order_index: orderIndex++,
                estimated_hours: Math.ceil(totalMinutes / 60),
                status: orderIndex === 1 ? "unlocked" : "locked",
              })
              .select()
              .single();

            if (taskError) {
              console.error("Error saving task:", taskError);
              continue;
            }

            // Save micro-tasks
            let microOrderIndex = 0;
            for (const microTask of task.microTasks) {
              await supabase.from("micro_tasks").insert({
                user_id: user.id,
                task_id: taskData.id,
                title: microTask.title,
                estimated_minutes: microTask.estimatedMinutes,
                order_index: microOrderIndex++,
                status: microOrderIndex === 1 ? "unlocked" : "locked",
              });
            }
          }
          phaseNumber++;
        }
      }

      toast({
        title: "Decomposition Complete",
        description: `Created ${aiPhases.length} phases with ${aiPhases.reduce((acc, p) => acc + p.tasks.length, 0)} tasks.`,
      });

    } catch (error) {
      console.error("Decomposition error:", error);
      toast({
        title: "Decomposition Failed",
        description: error instanceof Error ? error.message : "Failed to decompose goal",
        variant: "destructive",
      });
    } finally {
      setIsDecomposing(false);
    }
  };

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) =>
      prev.includes(phaseId)
        ? prev.filter((id) => id !== phaseId)
        : [...prev, phaseId]
    );
  };

  const toggleTask = (taskId: string) => {
    setExpandedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const getTotalTime = (phase: Phase) => {
    return phase.tasks.reduce(
      (acc, task) =>
        acc + task.microTasks.reduce((a, mt) => a + mt.estimatedMinutes, 0),
      0
    );
  };

  const handleBuildRoadmap = () => {
    if (goalId) {
      navigate(`/roadmap?goalId=${goalId}&goal=${encodeURIComponent(goal)}`);
    } else {
      navigate(`/roadmap?goal=${encodeURIComponent(goal)}`);
    }
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
              <Puzzle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Problem Decomposer</span>
              <TokenDisplay tokens={TOKEN_COST} size="sm" className="ml-2" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Break It Down to <span className="gradient-text">Atomic Tasks</span>
            </h1>
            <p className="text-muted-foreground">
              Each task ≤ 90 minutes. No vague verbs. Every task is measurable.
            </p>
            {user && (
              <div className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Coins className="w-4 h-4" />
                Your tokens: {tokens}
              </div>
            )}
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-xl card-gradient border border-border mb-8">
              <div className="space-y-2">
                <Label htmlFor="goal">What goal do you want to decompose?</Label>
                <Textarea
                  id="goal"
                  placeholder="e.g., Learn Backend Development, Prepare for Frontend Interviews, Build a SaaS product..."
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="min-h-[100px] bg-secondary/50"
                  required
                />
              </div>

              <Button type="submit" variant="hero" className="w-full" disabled={isDecomposing}>
                {isDecomposing ? (
                  <>
                    <Zap className="w-4 h-4 animate-pulse" />
                    Decomposing...
                  </>
                ) : (
                  <>
                    <Puzzle className="w-4 h-4" />
                    Decompose Goal ({TOKEN_COST} token)
                  </>
                )}
              </Button>
            </form>

            {/* Results */}
            {phases && (
              <div className="space-y-4 animate-slide-up">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Execution Plan</h2>
                  <div className="text-sm text-muted-foreground">
                    {phases.length} phases · {phases.reduce((acc, p) => acc + p.tasks.length, 0)} tasks
                  </div>
                </div>

                {phases.map((phase) => (
                  <Collapsible
                    key={phase.id}
                    open={expandedPhases.includes(phase.id)}
                    onOpenChange={() => togglePhase(phase.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <div className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 cursor-pointer transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {expandedPhases.includes(phase.id) ? (
                              <ChevronDown className="w-5 h-5 text-primary" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            )}
                            <span className="font-semibold">{phase.name}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{phase.tasks.length} tasks</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {Math.round(getTotalTime(phase) / 60)}h
                            </span>
                          </div>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 ml-4 space-y-2">
                      {phase.tasks.map((task) => (
                        <Collapsible
                          key={task.id}
                          open={expandedTasks.includes(task.id)}
                          onOpenChange={() => toggleTask(task.id)}
                        >
                          <CollapsibleTrigger asChild>
                            <div className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary cursor-pointer transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {expandedTasks.includes(task.id) ? (
                                    <ChevronDown className="w-4 h-4 text-primary" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                  )}
                                  <span className="text-sm font-medium">{task.title}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {task.microTasks.length} micro-tasks
                                </span>
                              </div>
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-1 ml-6 space-y-1">
                            {task.microTasks.map((mt) => (
                              <div
                                key={mt.id}
                                className="p-2 rounded-md bg-muted/30 flex items-center justify-between text-sm"
                              >
                                <span className="text-muted-foreground">{mt.title}</span>
                                <span className="text-xs font-mono text-primary">
                                  {mt.estimatedMinutes}m
                                </span>
                              </div>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))}

                <div className="flex gap-4 mt-8">
                  <Button variant="outline" className="flex-1" onClick={() => setPhases(null)}>
                    Decompose Another
                  </Button>
                  <Button variant="hero" className="flex-1" onClick={handleBuildRoadmap}>
                    Build Roadmap
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
