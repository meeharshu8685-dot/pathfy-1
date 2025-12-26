import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
    Zap,
    Target,
    Map,
    Clock,
    Award,
    BookOpen,
    Brain,
    CheckCircle2,
    ChevronRight,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
    {
        title: "Step 1: Check Path Feasibility",
        description: "Start by defining your goal. Pathfy analyzes your current skill level, available hours, and deadline to tell you if your goal is realistic or if you're risking burnout.",
        icon: Clock,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        link: "/reality-check",
        linkText: "Check Feasibility"
    },
    {
        title: "Step 2: Choose Your Approach",
        description: "Once feasibility is confirmed, choose how you want to achieve it. Whether it's a Competitive Exam, a new Skill, or a Research project—we tailor the roadmap to your style.",
        icon: Target,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        link: "/approach-planner",
        linkText: "Plan Approach"
    },
    {
        title: "Step 3: Generate Your Roadmap",
        description: "Get a personalized, day-by-day execution plan. We break down your big goal into manageable phases and steps so you always know what to do next.",
        icon: Map,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        link: "/roadmap",
        linkText: "Build Roadmap"
    },
    {
        title: "Step 4: Optimize Your Day",
        description: "Use the Study Optimizer to handle unexpected interruptions. If you lose time, Pathfy recalculates your daily tasks to keep you on track without feeling overwhelmed.",
        icon: Brain,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        link: "/study-optimizer",
        linkText: "Optimize Now"
    }
];

const HowToUse = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4">
                    {/* Hero Section */}
                    <div className="text-center mb-16 animate-in">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
                            <Sparkles className="h-4 w-4" />
                            Guide to Pathfy
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">How to use Pathfy</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Your step-by-step guide to turning ambitious goals into realistic, execution-ready systems.
                        </p>
                    </div>

                    {/* Interactive Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="group relative p-8 rounded-3xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 animate-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex flex-col h-full">
                                    <div className={`w-14 h-14 rounded-2xl ${step.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <step.icon className={`w-7 h-7 ${step.color}`} />
                                    </div>

                                    <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                                    <p className="text-muted-foreground mb-8 flex-grow leading-relaxed">
                                        {step.description}
                                    </p>

                                    <Link to={step.link}>
                                        <Button variant="ghost" className="group/btn gap-2 p-0 hover:bg-transparent hover:text-primary">
                                            {step.linkText}
                                            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Features Grid */}
                    <div className="rounded-[2.5rem] bg-card border border-border p-8 md:p-12 mb-24 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Zap className="w-64 h-64" />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
                                <CheckCircle2 className="w-8 h-8 text-primary" />
                                Key Features at a Glance
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                <div className="space-y-3">
                                    <div className="font-bold text-lg flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-primary" />
                                        Reality Check V2
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Analyzes path feasibility by considering your current situation (Student/Pro) and local time.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="font-bold text-lg flex items-center gap-2">
                                        <Award className="w-5 h-5 text-primary" />
                                        Token System
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Earn 2 tokens per share and 10 bonus tokens every 5 shares. Use them to generate smart roadmaps.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="font-bold text-lg flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-primary" />
                                        History & Edits
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Access your previously generated roadmaps and feasibility history. Edit and delete as you evolve.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Get Started CTA */}
                    <div className="text-center p-12 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                        <h2 className="text-3xl font-bold mb-6">Ready to start your journey?</h2>
                        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
                            Stop guessing and start executing. Join 1000+ users building better habits with Pathfy today.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/signup">
                                <Button size="lg" className="px-8 bg-primary hover:bg-primary/90">
                                    Create Free Account
                                </Button>
                            </Link>
                            <Link to="/pricing">
                                <Button variant="outline" size="lg" className="px-8">
                                    View Pricing
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default HowToUse;
