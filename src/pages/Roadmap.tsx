import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TokenDisplay } from "@/components/shared/TokenDisplay";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Map, Zap, Lock, Unlock, Check, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface RoadmapStep {
  id: number;
  task: string;
  dependencies: number[];
  estimatedHours: number;
  status: "locked" | "unlocked" | "completed";
  milestone?: string;
}

const mockRoadmap: RoadmapStep[] = [
  { id: 1, task: "Learn HTTP Protocol Basics", dependencies: [], estimatedHours: 3, status: "completed" },
  { id: 2, task: "Practice API Requests with Postman", dependencies: [1], estimatedHours: 2, status: "completed" },
  { id: 3, task: "Understand REST Principles", dependencies: [1], estimatedHours: 2, status: "unlocked", milestone: "Foundations Complete" },
  { id: 4, task: "Setup Node.js + Express Environment", dependencies: [3], estimatedHours: 2, status: "locked" },
  { id: 5, task: "Build First GET Endpoint", dependencies: [4], estimatedHours: 1, status: "locked" },
  { id: 6, task: "Implement CRUD Operations", dependencies: [5], estimatedHours: 4, status: "locked", milestone: "Basic API Complete" },
  { id: 7, task: "Learn SQL Fundamentals", dependencies: [6], estimatedHours: 4, status: "locked" },
  { id: 8, task: "Setup PostgreSQL Database", dependencies: [7], estimatedHours: 2, status: "locked" },
  { id: 9, task: "Connect API to Database", dependencies: [8], estimatedHours: 3, status: "locked", milestone: "Database Integration" },
  { id: 10, task: "Implement JWT Authentication", dependencies: [9], estimatedHours: 4, status: "locked" },
  { id: 11, task: "Add Protected Routes", dependencies: [10], estimatedHours: 2, status: "locked", milestone: "Auth Complete" },
  { id: 12, task: "Deploy to Production", dependencies: [11], estimatedHours: 3, status: "locked", milestone: "🎯 Goal Achieved" },
];

export default function Roadmap() {
  const [goal, setGoal] = useState("");
  const [steps, setSteps] = useState<RoadmapStep[] | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBuilding(true);

    setTimeout(() => {
      setSteps(mockRoadmap);
      setIsBuilding(false);
    }, 2000);
  };

  const completedSteps = steps?.filter((s) => s.status === "completed").length || 0;
  const totalSteps = steps?.length || 0;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const getStatusIcon = (status: RoadmapStep["status"]) => {
    switch (status) {
      case "completed":
        return <Check className="w-5 h-5 text-success" />;
      case "unlocked":
        return <Unlock className="w-5 h-5 text-primary" />;
      case "locked":
        return <Lock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
              <Map className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Roadmap Builder</span>
              <TokenDisplay tokens={2} size="sm" className="ml-2" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Dependency-Locked <span className="gradient-text">Execution Path</span>
            </h1>
            <p className="text-muted-foreground">
              No task starts before its prerequisites. Milestones mark your progress.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {!steps ? (
              <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-xl card-gradient border border-border">
                <div className="space-y-2">
                  <Label htmlFor="goal">What's your end goal?</Label>
                  <Textarea
                    id="goal"
                    placeholder="e.g., Become a Backend Developer, Land a Frontend Internship..."
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="min-h-[100px] bg-secondary/50"
                    required
                  />
                </div>

                <Button type="submit" variant="hero" className="w-full" disabled={isBuilding}>
                  {isBuilding ? (
                    <>
                      <Zap className="w-4 h-4 animate-pulse" />
                      Building Roadmap...
                    </>
                  ) : (
                    <>
                      <Map className="w-4 h-4" />
                      Build My Roadmap
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="animate-slide-up">
                {/* Progress Header */}
                <div className="p-6 rounded-xl card-gradient border border-border mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Your Execution Path</h2>
                    <span className="text-sm text-muted-foreground">
                      {completedSteps}/{totalSteps} steps completed
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Start</span>
                    <span>Goal</span>
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <div key={step.id}>
                      {/* Milestone */}
                      {step.milestone && index > 0 && (
                        <div className="flex items-center gap-4 my-6">
                          <div className="flex-1 h-px bg-border" />
                          <span className="text-sm font-medium text-primary px-4 py-1 rounded-full bg-primary/10 border border-primary/30">
                            {step.milestone}
                          </span>
                          <div className="flex-1 h-px bg-border" />
                        </div>
                      )}

                      <div
                        className={`p-4 rounded-xl border transition-all ${
                          step.status === "completed"
                            ? "bg-success/5 border-success/30"
                            : step.status === "unlocked"
                            ? "bg-primary/5 border-primary/30"
                            : "bg-card border-border opacity-60"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                            {getStatusIcon(step.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono text-muted-foreground">Step {step.id}</span>
                              {step.dependencies.length > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  ← requires {step.dependencies.join(", ")}
                                </span>
                              )}
                            </div>
                            <h3 className={`font-medium ${step.status === "locked" ? "text-muted-foreground" : ""}`}>
                              {step.task}
                            </h3>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-mono text-muted-foreground">
                              {step.estimatedHours}h
                            </div>
                            <StatusBadge status={step.status} className="mt-1" />
                          </div>
                        </div>
                      </div>

                      {/* Connector */}
                      {index < steps.length - 1 && (
                        <div className="flex justify-center py-1">
                          <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mt-8">
                  <Button variant="outline" className="flex-1" onClick={() => setSteps(null)}>
                    Build Another
                  </Button>
                  <Button variant="hero" className="flex-1" asChild>
                    <a href="/study-optimizer">What Should I Do Today?</a>
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
