import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TokenDisplay } from "@/components/shared/TokenDisplay";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, 
  Award, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  Copy,
  Download,
  Linkedin
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Profile() {
  const { user, isLoading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();

  if (authLoading) {
    return (
      <Layout>
        <div className="py-12 container mx-auto px-4">
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isLoading = profileLoading;

  const userProfile = {
    name: profile?.full_name || user.email?.split("@")[0] || "User",
    email: user.email || "",
    joined: profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "N/A",
    tokens: profile?.tokens ?? 0,
    totalTasksCompleted: profile?.completed_goals ?? 0,
    currentStreak: profile?.current_streak ?? 0,
    longestStreak: profile?.longest_streak ?? 0,
    totalHours: profile?.total_hours_logged ?? 0,
    reputation: (profile?.completed_goals ?? 0) * 50 + (profile?.current_streak ?? 0) * 10,
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="p-6 rounded-xl card-gradient border border-border text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-primary" />
                </div>
                {isLoading ? (
                  <>
                    <Skeleton className="h-8 w-32 mx-auto mb-2" />
                    <Skeleton className="h-4 w-48 mx-auto" />
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold mb-1">{userProfile.name}</h1>
                    <p className="text-muted-foreground text-sm mb-4">{userProfile.email}</p>
                    <TokenDisplay tokens={userProfile.tokens} size="sm" className="mx-auto" />
                    <p className="text-xs text-muted-foreground mt-4">Member since {userProfile.joined}</p>
                  </>
                )}
              </div>

              {/* Reputation */}
              <div className="p-6 rounded-xl card-gradient border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold">Reputation Score</h2>
                </div>
                {isLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : (
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-2">{userProfile.reputation}</div>
                    <Progress value={(userProfile.reputation / 1000) * 100} className="h-2 mb-2" />
                    <p className="text-xs text-muted-foreground">Next level: 1000 points</p>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="p-6 rounded-xl card-gradient border border-border">
                <h2 className="font-semibold mb-4">Lifetime Stats</h2>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Goals Completed</span>
                      <span className="font-bold">{userProfile.totalTasksCompleted}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Hours Logged</span>
                      <span className="font-bold">{userProfile.totalHours}h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Current Streak</span>
                      <span className="font-bold flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-success" />
                        {userProfile.currentStreak} days
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Longest Streak</span>
                      <span className="font-bold">{userProfile.longestStreak} days</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Getting Started */}
              {!isLoading && userProfile.totalTasksCompleted === 0 && (
                <div className="p-6 rounded-xl card-gradient border border-border">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Get Started
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Complete your first goal to unlock skill proofs and milestones!
                  </p>
                  <div className="flex gap-4">
                    <Button variant="hero" asChild>
                      <a href="/reality-check">Start Reality Check</a>
                    </Button>
                  </div>
                </div>
              )}

              {/* Milestones */}
              <div className="p-6 rounded-xl card-gradient border border-border">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  Completed Milestones
                </h2>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : userProfile.totalTasksCompleted > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-success/5 border border-success/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        </div>
                        <span className="font-medium">First Goal Completed</span>
                      </div>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Achieved
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No milestones yet. Complete goals to earn milestones!
                  </p>
                )}
              </div>

              {/* Skill Proofs */}
              <div className="p-6 rounded-xl card-gradient border border-border">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Skill Proofs
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Complete goals to generate skill proofs for your resume and LinkedIn.
                </p>

                {userProfile.totalTasksCompleted > 0 ? (
                  <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">Goal Achievement</h3>
                          <span className="text-xs text-primary font-medium">Beginner+</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Demonstrated commitment by completing {userProfile.totalTasksCompleted} goal(s).
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No skill proofs yet. Complete tasks to generate proofs!
                  </p>
                )}

                <Button variant="outline" className="w-full mt-6" disabled={userProfile.totalTasksCompleted === 0}>
                  <Download className="w-4 h-4 mr-2" />
                  Export All Proofs as PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
