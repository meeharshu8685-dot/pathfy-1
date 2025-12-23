import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type Roadmap = Tables<"roadmaps">;
type RoadmapStep = Tables<"roadmap_steps">;
type RoadmapInsert = TablesInsert<"roadmaps">;
type RoadmapStepInsert = TablesInsert<"roadmap_steps">;

export function useRoadmaps(goalId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: roadmaps, isLoading, error } = useQuery({
    queryKey: ["roadmaps", user?.id, goalId],
    queryFn: async () => {
      if (!user?.id) return [];
      let query = supabase
        .from("roadmaps")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      
      if (goalId) {
        query = query.eq("goal_id", goalId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Roadmap[];
    },
    enabled: !!user?.id,
  });

  const createRoadmap = useMutation({
    mutationFn: async (roadmap: Omit<RoadmapInsert, "user_id">) => {
      if (!user?.id) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("roadmaps")
        .insert({ ...roadmap, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmaps", user?.id] });
    },
  });

  const updateRoadmap = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Roadmap> & { id: string }) => {
      if (!user?.id) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("roadmaps")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmaps", user?.id] });
    },
  });

  return { roadmaps: roadmaps ?? [], isLoading, error, createRoadmap, updateRoadmap };
}

export function useRoadmapSteps(roadmapId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: steps, isLoading, error } = useQuery({
    queryKey: ["roadmap_steps", user?.id, roadmapId],
    queryFn: async () => {
      if (!user?.id || !roadmapId) return [];
      const { data, error } = await supabase
        .from("roadmap_steps")
        .select("*")
        .eq("user_id", user.id)
        .eq("roadmap_id", roadmapId)
        .order("order_index", { ascending: true });
      
      if (error) throw error;
      return data as RoadmapStep[];
    },
    enabled: !!user?.id && !!roadmapId,
  });

  const createStep = useMutation({
    mutationFn: async (step: Omit<RoadmapStepInsert, "user_id">) => {
      if (!user?.id) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("roadmap_steps")
        .insert({ ...step, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap_steps", user?.id] });
    },
  });

  const updateStep = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<RoadmapStep> & { id: string }) => {
      if (!user?.id) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("roadmap_steps")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap_steps", user?.id] });
    },
  });

  return { steps: steps ?? [], isLoading, error, createStep, updateStep };
}
