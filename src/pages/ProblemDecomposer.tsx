import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TokenDisplay } from "@/components/shared/TokenDisplay";
import { Puzzle, Zap, ChevronDown, ChevronRight, Clock } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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

const mockDecomposition: Phase[] = [
  {
    id: "1",
    name: "Phase 1: Foundations",
    tasks: [
      {
        id: "1-1",
        title: "Learn HTTP Protocol",
        microTasks: [
          { id: "1-1-1", title: "Read HTTP/1.1 specification overview (30 pages)", estimatedMinutes: 60 },
          { id: "1-1-2", title: "Practice: Analyze 10 HTTP requests using browser DevTools", estimatedMinutes: 45 },
          { id: "1-1-3", title: "Write a quiz: Identify headers from request/response", estimatedMinutes: 30 },
        ],
      },
      {
        id: "1-2",
        title: "Understand REST Principles",
        microTasks: [
          { id: "1-2-1", title: "Read REST architectural constraints document", estimatedMinutes: 45 },
          { id: "1-2-2", title: "Identify: Map 5 real APIs to REST principles", estimatedMinutes: 60 },
          { id: "1-2-3", title: "Design: Create REST endpoints for a todo app (on paper)", estimatedMinutes: 45 },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Phase 2: Core Skills",
    tasks: [
      {
        id: "2-1",
        title: "Build Your First API",
        microTasks: [
          { id: "2-1-1", title: "Setup: Initialize Express.js project with TypeScript", estimatedMinutes: 45 },
          { id: "2-1-2", title: "Code: Implement GET /health endpoint", estimatedMinutes: 20 },
          { id: "2-1-3", title: "Code: Implement CRUD for /users (in-memory)", estimatedMinutes: 90 },
          { id: "2-1-4", title: "Test: Verify all endpoints using Postman", estimatedMinutes: 30 },
        ],
      },
      {
        id: "2-2",
        title: "Add Database Integration",
        microTasks: [
          { id: "2-2-1", title: "Setup: Install and configure PostgreSQL locally", estimatedMinutes: 60 },
          { id: "2-2-2", title: "Learn: Complete SQL basics tutorial (SELECT, INSERT, UPDATE)", estimatedMinutes: 90 },
          { id: "2-2-3", title: "Code: Connect API to database using Prisma", estimatedMinutes: 60 },
          { id: "2-2-4", title: "Migrate: Move in-memory data to PostgreSQL", estimatedMinutes: 45 },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Phase 3: Authentication",
    tasks: [
      {
        id: "3-1",
        title: "Implement JWT Authentication",
        microTasks: [
          { id: "3-1-1", title: "Read: JWT specification and security best practices", estimatedMinutes: 45 },
          { id: "3-1-2", title: "Code: Implement /register and /login endpoints", estimatedMinutes: 90 },
          { id: "3-1-3", title: "Code: Create authentication middleware", estimatedMinutes: 60 },
          { id: "3-1-4", title: "Test: Verify protected routes require valid tokens", estimatedMinutes: 30 },
        ],
      },
    ],
  },
];

export default function ProblemDecomposer() {
  const [goal, setGoal] = useState("");
  const [phases, setPhases] = useState<Phase[] | null>(null);
  const [isDecomposing, setIsDecomposing] = useState(false);
  const [expandedPhases, setExpandedPhases] = useState<string[]>([]);
  const [expandedTasks, setExpandedTasks] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDecomposing(true);

    setTimeout(() => {
      setPhases(mockDecomposition);
      setExpandedPhases(["1"]);
      setIsDecomposing(false);
    }, 1500);
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

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
              <Puzzle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Problem Decomposer</span>
              <TokenDisplay tokens={1} size="sm" className="ml-2" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Break It Down to <span className="gradient-text">Atomic Tasks</span>
            </h1>
            <p className="text-muted-foreground">
              Each task ≤ 90 minutes. No vague verbs. Every task is measurable.
            </p>
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
                    Decompose Goal
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
                  <Button variant="hero" className="flex-1" asChild>
                    <a href="/roadmap">Build Roadmap</a>
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
