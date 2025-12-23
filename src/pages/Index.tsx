import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/shared/FeatureCard";
import { Link } from "react-router-dom";
import { SplashScreen } from "@/components/splash/SplashScreen";
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
  const [showSplash, setShowSplash] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    // Check if splash was already shown this session
    const splashShown = sessionStorage.getItem("splashShown");
    if (splashShown) {
      setShowSplash(false);
      setContentVisible(true);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem("splashShown", "true");
    setShowSplash(false);
    // Slight delay before showing content for smooth transition
    setTimeout(() => setContentVisible(true), 100);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      
      <Layout>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center hero-glow overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className={`absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl transition-all duration-1000 ${
                contentVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
              }`}
              style={{ animationDelay: "0.2s" }}
            />
            <div 
              className={`absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl transition-all duration-1000 delay-300 ${
                contentVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
              }`}
            />
            <div 
              className={`absolute top-1/2 right-1/3 w-48 h-48 bg-primary/5 rounded-full blur-2xl transition-all duration-1000 delay-500 ${
                contentVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
              }`}
            />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div 
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 backdrop-blur-sm border border-border mb-8 transition-all duration-700 ${
                  contentVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
                }`}
              >
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Execution Intelligence Engine</span>
              </div>
              
              {/* Main heading */}
              <h1 
                className={`text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight transition-all duration-700 delay-100 ${
                  contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <span className="block">Stop Planning.</span>
                <span className="block mt-2 text-gradient-animate">Start Executing.</span>
              </h1>
              
              {/* Subheading */}
              <p 
                className={`text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto transition-all duration-700 delay-200 ${
                  contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                Convert goals into realistic, dependency-aware, time-bounded execution systems. 
                Built for students and early professionals who want results, not excuses.
              </p>
              
              {/* CTA Buttons */}
              <div 
                className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${
                  contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <Link to="/reality-check">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto group">
                    Check Your Path
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="glass" size="xl" className="w-full sm:w-auto">
                    View Dashboard
                  </Button>
                </Link>
              </div>

              {/* Scroll indicator */}
              <div 
                className={`mt-16 sm:mt-20 transition-all duration-700 delay-500 ${
                  contentVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
                  <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
                  <div className="w-6 h-10 rounded-full border-2 border-current flex justify-center pt-2">
                    <div className="w-1.5 h-3 bg-current rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Anti-Patterns Section */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 
                className={`text-3xl md:text-4xl font-bold font-display mb-4 transition-all duration-700 ${
                  contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                We're Different
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Most productivity tools enable procrastination disguised as planning. We don't.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
              {/* What We Don't Do */}
              <div 
                className={`p-6 sm:p-8 rounded-2xl bg-destructive/5 border border-destructive/20 transition-all duration-500 hover:shadow-lg hover:scale-[1.02] ${
                  contentVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                }`}
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-destructive">
                  <XCircle className="w-5 h-5" />
                  We Never
                </h3>
                <ul className="space-y-3">
                  {antiPatterns.map((item, i) => (
                    <li 
                      key={i} 
                      className="flex items-start gap-3 text-muted-foreground"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <span className="text-destructive mt-0.5 font-medium">✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* What We Do */}
              <div 
                className={`p-6 sm:p-8 rounded-2xl bg-success/5 border border-success/20 transition-all duration-500 delay-100 hover:shadow-lg hover:scale-[1.02] ${
                  contentVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                }`}
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-success">
                  <CheckCircle2 className="w-5 h-5" />
                  We Always
                </h3>
                <ul className="space-y-3">
                  {proPatterns.map((item, i) => (
                    <li 
                      key={i} 
                      className="flex items-start gap-3 text-muted-foreground"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <span className="text-success mt-0.5 font-medium">✓</span>
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
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                Execution Tools
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Each tool uses the same AI with different execution instructions.
                Pay only for what you use.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.href}
                  className={`transition-all duration-500 ${
                    contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <FeatureCard {...feature} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto px-4">
            <div 
              className={`max-w-3xl mx-auto text-center p-8 sm:p-12 rounded-3xl card-gradient border border-border relative overflow-hidden transition-all duration-700 ${
                contentVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              {/* Animated glow */}
              <div className="absolute inset-0 hero-glow opacity-50" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
              
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
                  Ready to Execute?
                </h2>
                <p className="text-muted-foreground mb-8">
                  Start with 5 free tokens. No credit card required.
                </p>
                <Link to="/reality-check">
                  <Button variant="hero" size="xl" className="group">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}