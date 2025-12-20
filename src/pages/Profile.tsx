import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TokenDisplay } from "@/components/shared/TokenDisplay";
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

const userProfile = {
  name: "Alex Chen",
  email: "alex@example.com",
  joined: "Nov 2024",
  tokens: 23,
  totalTasksCompleted: 47,
  currentStreak: 12,
  longestStreak: 18,
  totalHours: 78,
  reputation: 720,
};

const completedMilestones = [
  { id: 1, title: "HTTP Protocol Mastery", completedAt: "Dec 10, 2024" },
  { id: 2, title: "REST API Foundations", completedAt: "Dec 15, 2024" },
  { id: 3, title: "Database Integration", completedAt: "Dec 18, 2024" },
];

const skillProofs = [
  {
    id: 1,
    skill: "REST API Development",
    level: "Intermediate",
    proof: "Built 3 fully-functional REST APIs with authentication and database integration",
    resumeBullet: "• Developed 3 production-ready REST APIs with JWT auth and PostgreSQL integration",
    linkedinDescription: "Proficient in REST API development with hands-on experience building authenticated endpoints, database integration, and deployment pipelines.",
  },
  {
    id: 2,
    skill: "Database Management",
    level: "Beginner+",
    proof: "Designed schemas, wrote complex queries, implemented migrations",
    resumeBullet: "• Designed and implemented PostgreSQL schemas with complex JOIN queries and migration workflows",
    linkedinDescription: "Experience with PostgreSQL database design, query optimization, and schema migrations for web applications.",
  },
];

export default function Profile() {
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
                <h1 className="text-2xl font-bold mb-1">{userProfile.name}</h1>
                <p className="text-muted-foreground text-sm mb-4">{userProfile.email}</p>
                <TokenDisplay tokens={userProfile.tokens} size="sm" className="mx-auto" />
                <p className="text-xs text-muted-foreground mt-4">Member since {userProfile.joined}</p>
              </div>

              {/* Reputation */}
              <div className="p-6 rounded-xl card-gradient border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold">Reputation Score</h2>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">{userProfile.reputation}</div>
                  <Progress value={(userProfile.reputation / 1000) * 100} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">Next level: 1000 points</p>
                </div>
              </div>

              {/* Stats */}
              <div className="p-6 rounded-xl card-gradient border border-border">
                <h2 className="font-semibold mb-4">Lifetime Stats</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Tasks Completed</span>
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
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Milestones */}
              <div className="p-6 rounded-xl card-gradient border border-border">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  Completed Milestones
                </h2>
                <div className="space-y-3">
                  {completedMilestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center justify-between p-4 rounded-lg bg-success/5 border border-success/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        </div>
                        <span className="font-medium">{milestone.title}</span>
                      </div>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {milestone.completedAt}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Proofs */}
              <div className="p-6 rounded-xl card-gradient border border-border">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Skill Proofs
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Generated from your completed tasks. Copy for resumes and LinkedIn.
                </p>

                <div className="space-y-6">
                  {skillProofs.map((proof) => (
                    <div key={proof.id} className="p-4 rounded-lg bg-secondary/50 border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{proof.skill}</h3>
                          <span className="text-xs text-primary font-medium">{proof.level}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{proof.proof}</p>

                      <div className="space-y-3">
                        {/* Resume Bullet */}
                        <div className="p-3 rounded-md bg-card border border-border">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-muted-foreground">RESUME BULLET</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(proof.resumeBullet, "Resume bullet")}
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </Button>
                          </div>
                          <p className="text-sm font-mono">{proof.resumeBullet}</p>
                        </div>

                        {/* LinkedIn Description */}
                        <div className="p-3 rounded-md bg-card border border-border">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                              <Linkedin className="w-3 h-3" /> LINKEDIN
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(proof.linkedinDescription, "LinkedIn description")}
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </Button>
                          </div>
                          <p className="text-sm">{proof.linkedinDescription}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full mt-6">
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
