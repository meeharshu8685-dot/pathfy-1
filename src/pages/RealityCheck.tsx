import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TokenDisplay } from "@/components/shared/TokenDisplay";
import { Target, Zap, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CheckResult {
  status: "realistic" | "warning" | "unrealistic";
  requiredHours: number;
  availableHours: number;
  gap: number;
  gapExplanation: string;
  recommendations: string[];
}

const mockResults: Record<string, CheckResult> = {
  unrealistic: {
    status: "unrealistic",
    requiredHours: 900,
    availableHours: 240,
    gap: -660,
    gapExplanation: "You're 660 hours short. Backend Engineering requires mastering HTTP, APIs, databases, authentication, deployment, and cloud infrastructure. At 10 hrs/week for 6 months, you have 240 hours available.",
    recommendations: [
      "Extend timeline to 18 months OR",
      "Narrow scope to 'API Development with Python' only",
      "Consider focusing on one tech stack (e.g., Node.js + PostgreSQL)",
      "Drop deployment/DevOps for now, focus on core backend skills",
    ],
  },
  warning: {
    status: "warning",
    requiredHours: 400,
    availableHours: 480,
    gap: 80,
    gapExplanation: "You have 80 hours buffer, which is tight. Any unexpected delays (sickness, work, life) will put you behind. Consider reducing scope or extending timeline by 1 month.",
    recommendations: [
      "Add 4-week buffer to your timeline",
      "Prioritize hands-on projects over passive learning",
      "Skip advanced topics until core skills are solid",
    ],
  },
  realistic: {
    status: "realistic",
    requiredHours: 300,
    availableHours: 520,
    gap: 220,
    gapExplanation: "You have a 220-hour buffer. This is healthy and accounts for unexpected delays. Your goal is achievable with consistent execution.",
    recommendations: [
      "Add one portfolio project to stand out",
      "Allocate 20% of time for interview prep",
      "Consider starting networking activities in parallel",
    ],
  },
};

export default function RealityCheck() {
  const [goal, setGoal] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [deadline, setDeadline] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const hours = parseInt(hoursPerWeek) || 10;
      if (hours <= 10) {
        setResult(mockResults.unrealistic);
      } else if (hours <= 15) {
        setResult(mockResults.warning);
      } else {
        setResult(mockResults.realistic);
      }
      setIsAnalyzing(false);
    }, 1500);
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
              <TokenDisplay tokens={1} size="sm" className="ml-2" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Is Your Goal <span className="gradient-text">Actually Achievable?</span>
            </h1>
            <p className="text-muted-foreground">
              Enter your goal and constraints. We'll tell you if you're being realistic or delusional.
            </p>
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

              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="deadline">Target Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="bg-secondary/50"
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="hero" className="w-full" disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Zap className="w-4 h-4 animate-pulse" />
                    Analyzing Reality...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4" />
                    Check My Reality
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
                  <Button variant="outline" className="flex-1" onClick={() => setResult(null)}>
                    Try Another Goal
                  </Button>
                  <Button variant="hero" className="flex-1" asChild>
                    <a href="/problem-decomposer">Decompose This Goal</a>
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
