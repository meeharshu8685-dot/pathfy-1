import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TokenDisplay } from "@/components/shared/TokenDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { GoalManagement } from "@/components/profile/GoalManagement";
import { DataReset } from "@/components/profile/DataReset";
import { AccountDeletion } from "@/components/profile/AccountDeletion";
import { ReassessmentReminder } from "@/components/profile/ReassessmentReminder";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import {
  User,
  Award,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Download,
  Settings,
  Activity,
  Edit,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { ShareEarnSection } from "@/components/pricing/ShareEarnSection";
import { toast } from "@/hooks/use-toast";

export default function Profile() {
  const { user, isLoading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

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

  const displayName = profile?.display_name || profile?.full_name || user.email?.split("@")[0] || "User";

  const userProfile = {
    name: displayName,
    email: user.email || "",
    joined: profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "N/A",
    tokens: profile?.tokens ?? 0,
    totalTasksCompleted: profile?.completed_goals ?? 0,
    currentStreak: profile?.current_streak ?? 0,
    longestStreak: profile?.longest_streak ?? 0,
    totalHours: profile?.total_hours_logged ?? 0,
    reputation: (profile?.completed_goals ?? 0) * 50 + (profile?.current_streak ?? 0) * 10,
    educationLevel: profile?.education_level,
    stream: profile?.stream,
    availableHours: profile?.available_hours_per_week,
    commitment: profile?.primary_commitment,
    studyTime: profile?.preferred_study_time,
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Activity
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Profile Sidebar */}
                <div className="space-y-6">
                  {/* Profile Card */}
                  <div className="p-6 rounded-xl card-gradient border border-border text-center">
                    <div className="mx-auto mb-4 flex justify-center">
                      <AvatarUpload size="lg" editable={true} />
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

                        <Link to="/pricing" className="block mt-4">
                          <Button variant="hero" size="sm" className="w-full gap-2">
                            Get More Tokens
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>

                        <p className="text-xs text-muted-foreground mt-4">Member since {userProfile.joined}</p>

                        {/* Quick info pills */}
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                          {userProfile.educationLevel && (
                            <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                              {userProfile.educationLevel}
                            </span>
                          )}
                          {userProfile.studyTime && (
                            <span className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
                              {userProfile.studyTime} learner
                            </span>
                          )}
                        </div>
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
                      </div>
                    )}
                </div>

                {/* Refer & Earn Section */}
                <ShareEarnSection />
              </div>

              {/* Main Content - Edit Profile */}
              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 rounded-xl card-gradient border border-border">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Edit className="w-5 h-5 text-primary" />
                      {isEditing ? "Edit Profile" : "Profile Information"}
                    </h2>
                    {!isEditing && (
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>

                  {isEditing ? (
                    <ProfileEditForm
                      onCancel={() => setIsEditing(false)}
                      onSave={() => setIsEditing(false)}
                    />
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-secondary/30">
                        <p className="text-sm text-muted-foreground">Display Name</p>
                        <p className="font-medium">{userProfile.name}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/30">
                        <p className="text-sm text-muted-foreground">Education Level</p>
                        <p className="font-medium">{userProfile.educationLevel || "Not set"}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/30">
                        <p className="text-sm text-muted-foreground">Stream / Background</p>
                        <p className="font-medium">{userProfile.stream || "Not set"}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/30">
                        <p className="text-sm text-muted-foreground">Hours per Week</p>
                        <p className="font-medium">{userProfile.availableHours ? `${userProfile.availableHours}h` : "Not set"}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/30">
                        <p className="text-sm text-muted-foreground">Primary Commitment</p>
                        <p className="font-medium capitalize">{userProfile.commitment || "Not set"}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/30">
                        <p className="text-sm text-muted-foreground">Preferred Study Time</p>
                        <p className="font-medium capitalize">{userProfile.studyTime || "Not set"}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
              <GoalManagement />
              <ReassessmentReminder />
              <DataReset />
              <AccountDeletion />
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Stats Sidebar */}
              <div className="space-y-6">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </Layout >
  );
}