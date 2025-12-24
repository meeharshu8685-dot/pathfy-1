import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Compass, ArrowRight, ArrowLeft, CheckCircle2, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useGoals } from "@/hooks/useGoals";
import { ApproachCard } from "@/components/approach/ApproachCard";
import { getApproachesForField, ApproachDefinition } from "@/lib/approachDefinitions";
import { evaluateAllApproaches, ApproachEvaluation, UserProfile } from "@/lib/approachEvaluator";

export default function GoalApproachPlanner() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();
    const { goals, updateGoal } = useGoals();

    const [selectedApproachId, setSelectedApproachId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [evaluations, setEvaluations] = useState<ApproachEvaluation[]>([]);

    // Get goalId from URL or find the most recent goal with completed reality check
    const goalIdFromUrl = searchParams.get("goalId");
    const currentGoal = goalIdFromUrl
        ? goals.find(g => g.id === goalIdFromUrl)
        : goals.find(g => g.feasibility_status && g.achievement_plan);

    useEffect(() => {
        if (currentGoal) {
            const approaches = getApproachesForField(currentGoal.field || 'other');

            // Calculate deadline in months
            const deadlineDate = new Date(currentGoal.deadline);
            const now = new Date();
            const timelineMonths = Math.max(1, Math.ceil((deadlineDate.getTime() - now.getTime()) / (30 * 24 * 60 * 60 * 1000)));

            const userProfile: UserProfile = {
                availableHoursPerDay: Math.round((currentGoal.hours_per_week || 10) / 6), // Assume 6 days/week
                availableHoursPerWeek: currentGoal.hours_per_week || 10,
                timelineMonths,
                currentLevel: (currentGoal.calibrated_skill_level || currentGoal.skill_level || 'beginner') as 'beginner' | 'intermediate' | 'advanced',
                hasOtherCommitments: true // Default to true for safety
            };

            const evaluated = evaluateAllApproaches(approaches, userProfile);
            setEvaluations(evaluated);

            // If goal already has a selected approach, pre-select it
            if (currentGoal.selected_approach_id) {
                setSelectedApproachId(currentGoal.selected_approach_id);
            }
        }
    }, [currentGoal]);

    const handleSelectApproach = (approachId: string) => {
        setSelectedApproachId(approachId);
    };

    const handleConfirmAndContinue = async () => {
        if (!selectedApproachId || !currentGoal || !user) {
            toast({ title: "Please select an approach", variant: "destructive" });
            return;
        }

        setIsSaving(true);

        try {
            // Save selected approach to the goal using mutation
            await updateGoal.mutateAsync({
                id: currentGoal.id,
                selected_approach_id: selectedApproachId
            });

            toast({
                title: "Approach Selected",
                description: "Your preparation approach has been saved. Proceeding to build your roadmap."
            });

            // Navigate to roadmap with the goalId
            navigate(`/roadmap?goalId=${currentGoal.id}`);

        } catch (error) {
            console.error("Error saving approach:", error);
            toast({ title: "Failed to save approach", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) {
        return (
            <Layout>
                <div className="container max-w-4xl py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">Please Login</h1>
                    <Button onClick={() => navigate("/login")}>Login to Continue</Button>
                </div>
            </Layout>
        );
    }

    if (!currentGoal) {
        return (
            <Layout>
                <div className="container max-w-4xl py-12 text-center">
                    <Compass className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h1 className="text-2xl font-bold mb-4">No Goal Found</h1>
                    <p className="text-muted-foreground mb-6">
                        Please complete the Path Feasibility check first to choose your approach.
                    </p>
                    <Button onClick={() => navigate("/reality-check")}>
                        Go to Path Feasibility
                    </Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container max-w-5xl px-4 py-8 space-y-8">
                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        <Compass className="h-4 w-4" />
                        Goal Approach Planner
                    </div>
                    <h1 className="text-3xl font-bold">Choose Your Preparation Approach</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Different approaches work for different people. Select the one that matches your timeline,
                        availability, and lifestyle. There's no "wrong" choice — only what fits you best.
                    </p>
                </div>

                {/* Goal Context */}
                <Card className="bg-secondary/30">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                            Your Goal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-medium text-lg">{currentGoal.title}</p>
                        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                            <span>⏱️ {currentGoal.hours_per_week}h/week available</span>
                            <span>📅 Deadline: {new Date(currentGoal.deadline).toLocaleDateString()}</span>
                            <span>📊 Level: {currentGoal.calibrated_skill_level || currentGoal.skill_level}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Info Banner */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-medium text-blue-700 dark:text-blue-300">How this works</p>
                        <p className="text-blue-600/80 dark:text-blue-400/80">
                            We've evaluated each approach based on your available time and timeline.
                            The fit status shows how well each approach matches your situation — but the final choice is yours.
                        </p>
                    </div>
                </div>

                {/* Approach Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {evaluations.map((evaluation) => (
                        <ApproachCard
                            key={evaluation.approach.id}
                            evaluation={evaluation}
                            isSelected={selectedApproachId === evaluation.approach.id}
                            onSelect={() => handleSelectApproach(evaluation.approach.id)}
                        />
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-border">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(`/reality-check?goalId=${currentGoal.id}`)}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Reality Check
                    </Button>

                    <Button
                        onClick={handleConfirmAndContinue}
                        disabled={!selectedApproachId || isSaving}
                        className="gap-2"
                    >
                        {isSaving ? "Saving..." : "Confirm & Build Roadmap"}
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </Layout>
    );
}
