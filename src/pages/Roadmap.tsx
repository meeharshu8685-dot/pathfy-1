import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { TokenDisplay } from "@/components/shared/TokenDisplay";
import { GoalSelector } from "@/components/shared/GoalSelector";
import { RoadmapPhase } from "@/components/roadmap/RoadmapPhase";
import { RoadmapRealityLayer } from "@/components/roadmap/RoadmapRealityLayer";
import { RoadmapPDFExport } from "@/components/roadmap/RoadmapPDFExport";
import { RoadmapPrerequisiteCheck } from "@/components/roadmap/RoadmapPrerequisiteCheck";
import { Map, Zap, Coins, RotateCcw, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTokens } from "@/hooks/useTokens";
import { useGoals } from "@/hooks/useGoals";
import { useRoadmaps } from "@/hooks/useRoadmaps";
import { toast } from "@/hooks/use-toast";
import { getGoalDurationWeeks, getApproachById } from "@/lib/approachDurationHelper";

interface RoadmapPhaseData {
  phaseNumber: number;
  phaseName: string;
  goal: string;
  timeEstimate: string;
  whatToLearn: string[];
  whatToDo: string[];
  outcome: string;
}

interface MentorRoadmap {
  phases: RoadmapPhaseData[];
  whatToIgnore: string[];
  howToUseThisRoadmap?: {
    dailyApproach: string;
    whenProgressFeelsSlow: string;
    whenToAdjust: string;
  };
  finalRealityCheck: string;
  closingMotivation: string;
}

const TOKEN_COST = 2;

export default function Roadmap() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { tokens, spendTokens, canAfford } = useTokens();
  const { goals } = useGoals();
  const { saveRoadmap } = useRoadmaps();

  const [roadmap, setRoadmap] = useState<MentorRoadmap | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isViewingHistory, setIsViewingHistory] = useState(false);

  // Get the goalId from URL
  const goalIdParam = searchParams.get("goalId");

  // Fetch existing roadmaps for this goal
  const { roadmaps: existingRoadmaps, isLoading: isLoadingRoadmaps } = useRoadmaps(goalIdParam);

  // Get the most recent approved goal
  const approvedGoal = goals.find(g =>
    g.feasibility_status && g.achievement_plan
  );

  const hasCompletedRealityCheck = !!approvedGoal?.feasibility_status;
  const hasCompletedDecomposer = !!approvedGoal?.achievement_plan;

  useEffect(() => {
    if (goalIdParam) {
      setSelectedGoalId(goalIdParam);
      // If we have existing roadmaps for this goal, load the most recent one
      if (existingRoadmaps && existingRoadmaps.length > 0) {
        const latestRoadmap = existingRoadmaps[0];
        setRoadmap({
          phases: latestRoadmap.phases,
          whatToIgnore: latestRoadmap.whatToIgnore || [],
          finalRealityCheck: latestRoadmap.finalRealityCheck || '',
          closingMotivation: latestRoadmap.closingMotivation || ''
        });
        setIsViewingHistory(true);
      }
    } else if (approvedGoal) {
      setSelectedGoalId(approvedGoal.id);
    }
  }, [goalIdParam, approvedGoal, existingRoadmaps]);

  const currentGoal = selectedGoalId
    ? goals.find(g => g.id === selectedGoalId)
    : approvedGoal;

  const handleBuildRoadmap = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to use this feature",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!currentGoal) {
      toast({
        title: "No Goal Found",
        description: "Please complete the Path Feasibility first",
        variant: "destructive",
      });
      return;
    }

    if (!canAfford(TOKEN_COST)) {
      toast({
        title: "Insufficient Tokens",
        description: `You need ${TOKEN_COST} tokens. You have ${tokens} tokens.`,
        variant: "destructive",
      });
      return;
    }

    setIsBuilding(true);
    setRoadmap(null);

    try {
      // Use approach duration if available, otherwise deadline
      const durationForApi = currentGoal.selected_approach_id && currentGoal.field
        ? getGoalDurationWeeks(currentGoal).weeks
        : Math.ceil((new Date(currentGoal.deadline).getTime() - Date.now()) / (7 * 24 * 60 * 60 * 1000));

      const { data, error } = await supabase.functions.invoke("analyze-goal", {
        body: {
          type: "roadmap-v2",
          goal: currentGoal.title,
          field: currentGoal.field || "general",
          skillLevel: currentGoal.calibrated_skill_level || currentGoal.skill_level,
          hoursPerWeek: currentGoal.hours_per_week,
          deadlineWeeks: durationForApi,
          approachName: selectedApproach?.name, // Pass approach context
        },
      });

      if (error) throw error;

      const result = data.result as MentorRoadmap;

      // Add required fields for persistence
      const fullRoadmap = {
        ...result,
        goal_id: currentGoal.id,
        title: currentGoal.title
      };

      setRoadmap(fullRoadmap);

      // Save to database
      await saveRoadmap.mutateAsync(fullRoadmap);

      await spendTokens.mutateAsync({
        amount: TOKEN_COST,
        feature: "roadmap-v2",
        description: `Mentor roadmap for: ${currentGoal.title.substring(0, 50)}...`,
      });

      toast({
        title: "Roadmap Created & Saved",
        description: `Your personalized ${result.phases.length}-phase roadmap is ready. Check History to view later.`,
      });

    } catch (error) {
      console.error("Roadmap error:", error);
      toast({
        title: "Roadmap Failed",
        description: error instanceof Error ? error.message : "Failed to build roadmap",
        variant: "destructive",
      });
    } finally {
      setIsBuilding(false);
    }
  };

  // Get duration from approach or deadline
  const durationInfo = currentGoal
    ? getGoalDurationWeeks(currentGoal)
    : { weeks: 12, source: 'deadline' as const };

  const deadlineWeeks = durationInfo.weeks;
  const approachName = durationInfo.approachName;

  // Get selected approach details
  const selectedApproach = currentGoal?.selected_approach_id && currentGoal?.field
    ? getApproachById(currentGoal.field, currentGoal.selected_approach_id)
    : null;

  const canBuildRoadmap = hasCompletedRealityCheck && hasCompletedDecomposer && currentGoal;

  const handlePhaseUpdate = async (updatedPhase: RoadmapPhaseData) => {
    if (!roadmap) return;

    const newPhases = roadmap.phases.map(p =>
      p.phaseNumber === updatedPhase.phaseNumber ? { ...p, ...updatedPhase } : p
    );

    const updatedRoadmap = { ...roadmap, phases: newPhases };
    setRoadmap(updatedRoadmap);

    try {
      await saveRoadmap.mutateAsync(updatedRoadmap);
      toast({ title: "Roadmap updated" });
    } catch (error) {
      console.error("Failed to update roadmap:", error);
      toast({ title: "Failed to save changes", variant: "destructive" });
    }
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          {/* ... (Header section remains same) */}
          <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-secondary border border-border">
              <Map className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium">Roadmap Generator</span>
              <TokenDisplay tokens={TOKEN_COST} size="sm" className="ml-1 sm:ml-2 scale-90 sm:scale-100" />
            </div>
            <h1 className="text-2xl sm:text-5xl font-bold font-display tracking-tight leading-tight px-2">
              Your <span className="gradient-text">Mentor-Written</span> Roadmap
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground max-w-lg mx-auto px-4">
              A calm, realistic learning path written by someone who's been there before.
            </p>
            {user && (
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground bg-secondary/30 w-fit mx-auto px-3 py-1 rounded-full border border-border/50">
                <Coins className="w-3.5 h-3.5 text-primary" />
                <span>Tokens: {tokens}</span>
              </div>
            )}
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Goal Selector */}
            {goals.filter(g => g.feasibility_status && g.achievement_plan).length > 1 && (
              <div className="mb-6">
                <GoalSelector
                  goals={goals}
                  selectedGoalId={selectedGoalId}
                  onSelectGoal={(goalId) => {
                    setSelectedGoalId(goalId);
                    setRoadmap(null);
                    setIsViewingHistory(false);
                  }}
                  filterCompleted={true}
                />
              </div>
            )}

            {/* Prerequisite Check */}
            <RoadmapPrerequisiteCheck
              hasCompletedRealityCheck={hasCompletedRealityCheck}
              hasCompletedDecomposer={hasCompletedDecomposer}
              goalTitle={currentGoal?.title}
            />

            {!roadmap ? (
              /* Build Roadmap Section */
              <div className="p-8 rounded-xl card-gradient border border-border">
                {currentGoal ? (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Ready to Build Your Roadmap</h2>
                      <p className="text-muted-foreground text-sm">
                        Based on your Path Feasibility and goal analysis, we'll create a personalized
                        phase-by-phase learning path.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                      <div className="text-sm text-muted-foreground mb-1">Your Goal</div>
                      <div className="font-medium">{currentGoal.title}</div>
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                        <span>{currentGoal.hours_per_week}h/week</span>
                        <span>{deadlineWeeks} weeks</span>
                        <span className="capitalize">{currentGoal.calibrated_skill_level || currentGoal.skill_level}</span>
                      </div>
                      {selectedApproach && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="text-xs font-medium text-primary uppercase mb-1">Selected Approach</div>
                          <div className="text-sm font-medium">{selectedApproach.name}</div>
                          <div className="text-xs text-muted-foreground">{selectedApproach.durationRange} • {selectedApproach.dailyEffortRange}/day</div>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="hero"
                      className="w-full"
                      onClick={handleBuildRoadmap}
                      disabled={isBuilding || !canBuildRoadmap}
                    >
                      {isBuilding ? (
                        <>
                          <Zap className="w-4 h-4 animate-pulse" />
                          Creating Your Roadmap...
                        </>
                      ) : (
                        <>
                          <Map className="w-4 h-4" />
                          Build My Roadmap ({TOKEN_COST} tokens)
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      ⏱️ This may take 15-30 seconds as we craft your personalized roadmap
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      No approved goal found. Complete the Path Feasibility first.
                    </p>
                    <Button variant="outline" onClick={() => navigate("/reality-check")}>
                      Start Path Feasibility
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              /* Roadmap Display */
              <div className="animate-slide-up space-y-6">
                {/* Roadmap Header */}
                <div className="p-6 rounded-xl card-gradient border border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="space-y-1">
                      <h2 className="text-lg sm:text-xl font-bold font-display">{currentGoal?.title}</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-3">
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md font-medium">{roadmap.phases.length} phases</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {deadlineWeeks} weeks</span>
                        <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> {currentGoal?.hours_per_week}h/week</span>
                      </p>
                    </div>
                    <div className="sm:ml-auto">
                      <RoadmapPDFExport
                        goalTitle={currentGoal?.title || "Goal"}
                        duration={`${deadlineWeeks} weeks`}
                        hoursPerWeek={currentGoal?.hours_per_week || 10}
                        phases={roadmap.phases}
                        whatToIgnore={roadmap.whatToIgnore}
                        finalRealityCheck={roadmap.finalRealityCheck}
                        closingMotivation={roadmap.closingMotivation}
                      />
                    </div>
                  </div>
                </div>

                {/* Phases */}
                <div className="space-y-4">
                  {roadmap.phases.map((phase, index) => (
                    <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <RoadmapPhase
                        {...phase}
                        isEditable={true}
                        onUpdate={handlePhaseUpdate}
                      />
                    </div>
                  ))}
                </div>

                {/* Reality Layer */}
                <RoadmapRealityLayer
                  whatToIgnore={roadmap.whatToIgnore}
                  howToUseThisRoadmap={roadmap.howToUseThisRoadmap}
                  finalRealityCheck={roadmap.finalRealityCheck}
                  closingMotivation={roadmap.closingMotivation}
                />

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <Button variant="outline" className="flex-1 gap-2" onClick={() => setRoadmap(null)}>
                    <RotateCcw className="w-4 h-4" />
                    Generate New Roadmap
                  </Button>
                  <Button variant="hero" className="flex-1" asChild>
                    <a href="/study-optimizer">What Should I Do Today?</a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
