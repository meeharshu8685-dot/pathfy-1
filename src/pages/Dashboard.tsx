import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { TokenDisplay } from "@/components/shared/TokenDisplay";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import {
  Target,
  Puzzle,
  Map,
  Clock,
  Flame,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Calendar,
} from "lucide-react";

const userStats = {
  tokens: 12,
  maxTokens: 50,
  streak: 7,
  tasksCompleted: 23,
  hoursLogged: 34,
  consistency: 82,
};

const recentActivity = [
  { type: "reality-check", title: "Backend Engineer Goal", status: "warning" as const, date: "2 hours ago" },
  { type: "roadmap", title: "12-step execution path", status: "completed" as const, date: "Yesterday" },
  { type: "optimizer", title: "2h focused session", status: "completed" as const, date: "Yesterday" },
];

const activeGoals = [
  {
    id: 1,
    title: "Backend Developer Ready",
    progress: 38,
    nextMilestone: "Database Integration",
    daysRemaining: 45,
  },
];

const warnings = [
  {
    id: 1,
    type: "overplanning",
    message: "You've regenerated your roadmap 3 times this week. Stop planning, start executing.",
  },
];

export default function Dashboard() {
  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Execution Dashboard</h1>
              <p className="text-muted-foreground">Your progress, warnings, and next actions.</p>
            </div>
            <TokenDisplay tokens={userStats.tokens} maxTokens={userStats.maxTokens} size="lg" />
          </div>

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="mb-8 space-y-3">
              {warnings.map((warning) => (
                <div
                  key={warning.id}
                  className="p-4 rounded-xl bg-warning/10 border border-warning/30 flex items-start gap-3"
                >
                  <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold uppercase text-warning">
                      {warning.type.replace("-", " ")}
                    </span>
                    <p className="text-sm text-foreground mt-1">{warning.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Active Goals */}
              <div className="p-6 rounded-xl card-gradient border border-border">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Active Goals
                </h2>
                {activeGoals.map((goal) => (
                  <div key={goal.id} className="p-4 rounded-lg bg-secondary/50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{goal.title}</h3>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {goal.daysRemaining} days left
                      </span>
                    </div>
                    <Progress value={goal.progress} className="h-2 mb-3" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Next: <span className="text-foreground">{goal.nextMilestone}</span>
                      </span>
                      <span className="text-primary font-medium">{goal.progress}%</span>
                    </div>
                  </div>
                ))}
                <Link to="/reality-check" className="block mt-4">
                  <Button variant="outline" className="w-full">
                    Add New Goal
                  </Button>
                </Link>
              </div>

              {/* Quick Actions */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Link to="/study-optimizer">
                  <div className="p-4 rounded-xl card-gradient border border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
                    <Clock className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-1">What to do now?</h3>
                    <p className="text-sm text-muted-foreground">Get today's optimized tasks</p>
                  </div>
                </Link>
                <Link to="/roadmap">
                  <div className="p-4 rounded-xl card-gradient border border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
                    <Map className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-1">View Roadmap</h3>
                    <p className="text-sm text-muted-foreground">See your execution path</p>
                  </div>
                </Link>
              </div>

              {/* Recent Activity */}
              <div className="p-6 rounded-xl card-gradient border border-border">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        {activity.type === "reality-check" && <Target className="w-4 h-4 text-muted-foreground" />}
                        {activity.type === "roadmap" && <Map className="w-4 h-4 text-muted-foreground" />}
                        {activity.type === "optimizer" && <Clock className="w-4 h-4 text-muted-foreground" />}
                        <span className="text-sm">{activity.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={activity.status} />
                        <span className="text-xs text-muted-foreground">{activity.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="p-6 rounded-xl card-gradient border border-border">
                <h2 className="text-lg font-semibold mb-4">Your Stats</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-warning" />
                      <span className="text-sm">Current Streak</span>
                    </div>
                    <span className="text-xl font-bold">{userStats.streak} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      <span className="text-sm">Tasks Completed</span>
                    </div>
                    <span className="text-xl font-bold">{userStats.tasksCompleted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="text-sm">Hours Logged</span>
                    </div>
                    <span className="text-xl font-bold">{userStats.hoursLogged}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <span className="text-sm">Consistency</span>
                    </div>
                    <span className="text-xl font-bold">{userStats.consistency}%</span>
                  </div>
                </div>
              </div>

              {/* Token Usage */}
              <div className="p-6 rounded-xl card-gradient border border-border">
                <h2 className="text-lg font-semibold mb-4">Token Usage</h2>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-primary mb-1">{userStats.tokens}</div>
                  <div className="text-sm text-muted-foreground">of {userStats.maxTokens} tokens remaining</div>
                </div>
                <Progress value={(userStats.tokens / userStats.maxTokens) * 100} className="h-2 mb-4" />
                <Link to="/pricing">
                  <Button variant="hero" className="w-full">
                    Get More Tokens
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Feature Shortcuts */}
              <div className="p-6 rounded-xl card-gradient border border-border">
                <h2 className="text-lg font-semibold mb-4">Quick Tools</h2>
                <div className="space-y-2">
                  <Link to="/reality-check">
                    <Button variant="ghost" className="w-full justify-start">
                      <Target className="w-4 h-4 mr-2" />
                      Reality Check
                      <span className="ml-auto text-xs text-muted-foreground">1 token</span>
                    </Button>
                  </Link>
                  <Link to="/problem-decomposer">
                    <Button variant="ghost" className="w-full justify-start">
                      <Puzzle className="w-4 h-4 mr-2" />
                      Decomposer
                      <span className="ml-auto text-xs text-muted-foreground">1 token</span>
                    </Button>
                  </Link>
                  <Link to="/roadmap">
                    <Button variant="ghost" className="w-full justify-start">
                      <Map className="w-4 h-4 mr-2" />
                      Roadmap
                      <span className="ml-auto text-xs text-muted-foreground">2 tokens</span>
                    </Button>
                  </Link>
                  <Link to="/study-optimizer">
                    <Button variant="ghost" className="w-full justify-start">
                      <Clock className="w-4 h-4 mr-2" />
                      Optimizer
                      <span className="ml-auto text-xs text-muted-foreground">1 token</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
