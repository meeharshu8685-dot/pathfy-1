import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { TokenDisplay } from "@/components/shared/TokenDisplay";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useGoals } from "@/hooks/useGoals";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { goals, isLoading: goalsLoading } = useGoals();

  if (authLoading) {
    return (
      <Layout>
        <div className="py-12 container mx-auto px-4">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isLoading = profileLoading || goalsLoading;

  const userStats = {
    tokens: profile?.tokens ?? 0,
    maxTokens: 50,
    streak: profile?.current_streak ?? 0,
    tasksCompleted: profile?.completed_goals ?? 0,
    hoursLogged: profile?.total_hours_logged ?? 0,
    consistency: profile?.current_streak ? Math.min(Math.round((profile.current_streak / 30) * 100), 100) : 0,
  };

  const activeGoals = goals.map((goal) => {
    const daysRemaining = Math.max(0, Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
    return {
      id: goal.id,
      title: goal.title,
      progress: 0, // TODO: Calculate from completed tasks
      nextMilestone: "Start learning",
      daysRemaining,
      status: goal.feasibility_status,
    };
  });

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Execution Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {profile?.full_name || user.email?.split("@")[0]}
              </p>
            </div>
            {isLoading ? (
              <Skeleton className="h-10 w-32" />
            ) : (
              <TokenDisplay tokens={userStats.tokens} maxTokens={userStats.maxTokens} size="lg" />
            )}
          </div>

          {/* No goals message */}
          {!isLoading && activeGoals.length === 0 && (
            <div className="mb-8 p-8 rounded-xl card-gradient border border-border text-center">
              <Target className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">No Active Goals</h2>
              <p className="text-muted-foreground mb-6">
                Start by checking if your career goal is realistic.
              </p>
              <Link to="/reality-check">
                <Button variant="hero">
                  <Target className="w-4 h-4 mr-2" />
                  Start Path Feasibility
                </Button>
              </Link>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Active Goals */}
              {activeGoals.length > 0 && (
                <div className="p-6 rounded-xl card-gradient border border-border">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Active Goals
                  </h2>
                  <div className="space-y-4">
                    {activeGoals.map((goal) => (
                      <div key={goal.id} className="p-4 rounded-lg bg-secondary/50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{goal.title}</h3>
                            {goal.status && <StatusBadge status={goal.status} />}
                          </div>
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
                  </div>
                  <Link to="/reality-check" className="block mt-4">
                    <Button variant="outline" className="w-full">
                      Add New Goal
                    </Button>
                  </Link>
                </div>
              )}

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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="p-6 rounded-xl card-gradient border border-border">
                <h2 className="text-lg font-semibold mb-4">Your Stats</h2>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ) : (
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
                        <span className="text-sm">Goals Completed</span>
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
                )}
              </div>

              {/* Token Usage */}
              <div className="p-6 rounded-xl card-gradient border border-border">
                <h2 className="text-lg font-semibold mb-4">Token Usage</h2>
                {isLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-primary mb-1">{userStats.tokens}</div>
                      <div className="text-sm text-muted-foreground">tokens remaining</div>
                    </div>
                    <Progress value={(userStats.tokens / userStats.maxTokens) * 100} className="h-2 mb-4" />
                    <Link to="/pricing">
                      <Button variant="hero" className="w-full">
                        Get More Tokens
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Feature Shortcuts */}
              <div className="p-6 rounded-xl card-gradient border border-border">
                <h2 className="text-lg font-semibold mb-4">Quick Tools</h2>
                <div className="space-y-2">
                  <Link to="/reality-check">
                    <Button variant="ghost" className="w-full justify-start">
                      <Target className="w-4 h-4 mr-2" />
                      Path Feasibility
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
