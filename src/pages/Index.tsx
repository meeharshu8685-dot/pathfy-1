import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/shared/FeatureCard";
import { Link } from "react-router-dom";
import { 
  Target, 
  Puzzle, 
  Map, 
  Clock, 
  ArrowRight, 
  CheckCircle2,
  XCircle,
  Zap
} from "lucide-react";

const features = [
  {
    icon: <Target className="w-6 h-6" />,
    title: "Path Feasibility",
    description: "Validate if your goal is actually achievable given your constraints. No more wishful thinking.",
    href: "/reality-check",
    tokenCost: 1,
  },
  {
    icon: <Puzzle className="w-6 h-6" />,
    title: "Problem Decomposer",
    description: "Convert vague goals into atomic, unblockable tasks. Each task ≤ 90 minutes.",
    href: "/problem-decomposer",
    tokenCost: 1,
  },
  {
    icon: <Map className="w-6 h-6" />,
    title: "Roadmap Builder",
    description: "Create a dependency-locked execution path. No task starts before its prerequisites.",
    href: "/roadmap",
    tokenCost: 2,
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Study Optimizer",
    description: "Decide what to do TODAY based on available time and focus level. Not in theory.",
    href: "/study-optimizer",
    tokenCost: 1,
  },
];

const antiPatterns = [
  "Give generic advice",
  "Suggest parallel learning",
  "Assume unlimited time",
  "Hallucinate timelines",
  "Enable fake productivity",
];

const proPatterns = [
  "Be conservative, not optimistic",
  "Reject unrealistic goals",
  "Enforce correct learning order",
  "Optimize for execution",
  "Produce structured outputs",
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center hero-glow">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Execution Intelligence Engine</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Stop Planning.
              <br />
              <span className="gradient-text">Start Executing.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Convert goals into realistic, dependency-aware, time-bounded execution systems. 
              Built for students and early professionals who want results, not excuses.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/reality-check">
                <Button variant="hero" size="xl">
                  Check Your Path
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="xl">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Anti-Patterns Section */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              We're Different
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Most productivity tools enable procrastination disguised as planning. We don't.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* What We Don't Do */}
            <div className="p-6 rounded-xl bg-destructive/5 border border-destructive/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-destructive">
                <XCircle className="w-5 h-5" />
                We Never
              </h3>
              <ul className="space-y-3">
                {antiPatterns.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-destructive mt-0.5">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* What We Do */}
            <div className="p-6 rounded-xl bg-success/5 border border-success/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-success">
                <CheckCircle2 className="w-5 h-5" />
                We Always
              </h3>
              <ul className="space-y-3">
                {proPatterns.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-success mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Execution Tools
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Each tool uses the same AI with different execution instructions.
              Pay only for what you use.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.href} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center p-12 rounded-2xl card-gradient border border-border relative overflow-hidden">
            <div className="absolute inset-0 hero-glow opacity-50" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Execute?
              </h2>
              <p className="text-muted-foreground mb-8">
                Start with 5 free tokens. No credit card required.
              </p>
              <Link to="/reality-check">
                <Button variant="hero" size="xl">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
