import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TokenDisplay } from "@/components/shared/TokenDisplay";
import { Clock, Zap, Brain, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

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

const mockResults: Record<string, OptimizerResult> = {
  low: {
    tasks: [
      {
        id: "1",
        title: "Review SQL JOIN syntax (passive)",
        estimatedMinutes: 25,
        priority: "medium",
        reason: "Low-intensity review, suitable for low focus",
      },
    ],
    focusWarning: "⚠️ Low focus detected. Avoiding new concepts. Focus on review only.",
    totalTime: 25,
  },
  medium: {
    tasks: [
      {
        id: "1",
        title: "Complete REST API quiz",
        estimatedMinutes: 30,
        priority: "high",
        reason: "On critical path, builds on yesterday's work",
      },
      {
        id: "2",
        title: "Setup PostgreSQL locally",
        estimatedMinutes: 45,
        priority: "critical",
        reason: "Blocking next 3 tasks in your roadmap",
      },
    ],
    totalTime: 75,
  },
  high: {
    tasks: [
      {
        id: "1",
        title: "Implement JWT authentication endpoint",
        estimatedMinutes: 90,
        priority: "critical",
        reason: "Complex task, requires deep focus. You have the capacity now.",
      },
      {
        id: "2",
        title: "Write unit tests for auth middleware",
        estimatedMinutes: 45,
        priority: "high",
        reason: "Validates previous work, prevents future bugs",
      },
      {
        id: "3",
        title: "Document API endpoints in README",
        estimatedMinutes: 25,
        priority: "medium",
        reason: "Good wind-down task, uses remaining time productively",
      },
    ],
    totalTime: 160,
  },
};

export default function StudyOptimizer() {
  const [availableTime, setAvailableTime] = useState("");
  const [focusLevel, setFocusLevel] = useState([50]);
  const [result, setResult] = useState<OptimizerResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOptimizing(true);

    setTimeout(() => {
      const focus = focusLevel[0];
      if (focus < 30) {
        setResult(mockResults.low);
      } else if (focus < 70) {
        setResult(mockResults.medium);
      } else {
        setResult(mockResults.high);
      }
      setIsOptimizing(false);
    }, 1200);
  };

  const getFocusLabel = (value: number) => {
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
              <TokenDisplay tokens={1} size="sm" className="ml-2" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              What Should You Do <span className="gradient-text">Right Now?</span>
            </h1>
            <p className="text-muted-foreground">
              Tell us your time and focus. We'll tell you exactly what to execute.
            </p>
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
                    {getFocusLabel(focusLevel[0])}
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
                    Optimize My Time
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
