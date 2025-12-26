import { Layout } from "@/components/layout/Layout";
import { Zap, Heart, Shield, Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="text-center space-y-4 mb-16 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        <Zap className="h-4 w-4" />
                        Our Mission
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-display">About Pathfy</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        We build tools for the execution-minded. Pathfy is designed to bridge the gap between ambitious goals and realistic achievements through data-driven planning.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <Card variant="glass" className="border-primary/20">
                        <CardContent className="p-8 space-y-4 text-center">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold">The Vision</h3>
                            <p className="text-muted-foreground">
                                In a world of constant noise and over-inflated hype, we focus on what actually works: consistency, realistic timelines, and intelligent decomposition.
                            </p>
                        </CardContent>
                    </Card>

                    <Card variant="glass">
                        <CardContent className="p-8 space-y-4 text-center">
                            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold">The Team</h3>
                            <p className="text-muted-foreground">
                                Built by <strong>Harsh Vishwakarma</strong>, with insights and strategic inputs from <strong>Abhishek Gaud</strong>.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-12 animate-slide-up">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-8">What We Stand For</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
                            <div className="space-y-3">
                                <div className="text-primary font-bold flex items-center gap-2">
                                    <Rocket className="h-4 w-4" /> 01. No Hype
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    We don't promise overnight success. We provide the roadmap for the long, rewarding grind.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="text-primary font-bold flex items-center gap-2">
                                    <Rocket className="h-4 w-4" /> 02. Data Driven
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Every feasibility check and roadmap is calibrated against real-world constraints and effort requirements.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="text-primary font-bold flex items-center gap-2">
                                    <Rocket className="h-4 w-4" /> 03. User First
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Our tools are built to solve our own problems first, ensuring they provide maximum value to you.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-24 pt-12 border-t border-border text-center">
                    <p className="text-muted-foreground">
                        © {new Date().getFullYear()} Pathfy. All rights reserved.
                    </p>
                    <p className="mt-2 font-medium">
                        Built by Harsh Vishwakarma, with inputs from Abhishek Gaud.
                    </p>
                </div>
            </div>
        </Layout>
    );
}
