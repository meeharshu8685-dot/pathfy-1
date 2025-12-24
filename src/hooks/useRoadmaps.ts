import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface RoadmapPhaseData {
  id?: string;
  phaseNumber: number;
  phaseName: string;
  goal: string;
  timeEstimate: string;
  whatToLearn: string[];
  whatToDo: string[];
  outcome: string;
}

export interface MentorRoadmap {
  id?: string;
  goal_id: string;
  title: string;
  phases: RoadmapPhaseData[];
  whatToIgnore: string[];
  finalRealityCheck: string;
  closingMotivation: string;
  created_at?: string;
}

export function useRoadmaps(goalId?: string | null) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: roadmaps, isLoading } = useQuery({
    queryKey: ["roadmaps", goalId],
    queryFn: async () => {
      if (!goalId) return [];

      const { data: roadmapsData, error: roadmapsError } = await supabase
        .from("roadmaps")
        .select(`
          *,
          roadmap_steps (*)
        `)
        .eq("goal_id", goalId)
        .order("created_at", { ascending: false });

      if (roadmapsError) throw roadmapsError;

      return roadmapsData.map((rm: any) => ({
        id: rm.id,
        goal_id: rm.goal_id,
        title: rm.title,
        whatToIgnore: rm.what_to_ignore || [],
        finalRealityCheck: rm.final_reality_check,
        closingMotivation: rm.closing_motivation,
        created_at: rm.created_at,
        phases: rm.roadmap_steps
          .sort((a: any, b: any) => a.phase_number - b.phase_number)
          .map((step: any) => ({
            id: step.id,
            phaseNumber: step.phase_number,
            phaseName: step.title,
            goal: step.description,
            timeEstimate: `${step.estimated_hours} hours`,
            whatToLearn: step.what_to_learn || [],
            whatToDo: step.what_to_do || [],
            outcome: step.outcome
          }))
      })) as MentorRoadmap[];
    },
    enabled: !!goalId,
  });

  const saveRoadmap = useMutation({
    mutationFn: async (roadmap: MentorRoadmap) => {
      if (!user?.id) throw new Error("Not authenticated");

      // 1. Insert/Update Roadmap
      const { data: rmData, error: rmError } = await supabase
        .from("roadmaps")
        .upsert({
          id: roadmap.id,
          goal_id: roadmap.goal_id,
          user_id: user.id,
          title: roadmap.title,
          what_to_ignore: roadmap.whatToIgnore,
          final_reality_check: roadmap.finalRealityCheck,
          closing_motivation: roadmap.closingMotivation,
          total_steps: roadmap.phases.length,
          is_active: true
        })
        .select()
        .single();

      if (rmError) throw rmError;

      // 2. Insert/Update Steps
      const stepsToInsert = roadmap.phases.map((phase) => ({
        id: phase.id,
        roadmap_id: rmData.id,
        user_id: user.id,
        phase_number: phase.phaseNumber,
        title: phase.phaseName,
        description: phase.goal,
        estimated_hours: parseInt(phase.timeEstimate) || 0,
        order_index: phase.phaseNumber,
        what_to_learn: phase.whatToLearn,
        what_to_do: phase.whatToDo,
        outcome: phase.outcome,
        status: "locked" as const
      }));

      const { error: stepsError } = await supabase
        .from("roadmap_steps")
        .upsert(stepsToInsert);

      if (stepsError) throw stepsError;

      return rmData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmaps", goalId] });
    },
  });

  return { roadmaps: roadmaps ?? [], isLoading, saveRoadmap };
}
