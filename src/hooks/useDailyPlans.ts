import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type DailyPlan = Tables<"daily_plans">;
type DailyPlanInsert = TablesInsert<"daily_plans">;

export function useDailyPlans() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: plans, isLoading, error } = useQuery({
    queryKey: ["daily_plans", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("daily_plans")
        .select("*")
        .eq("user_id", user.id)
        .order("plan_date", { ascending: false })
        .limit(30);
      
      if (error) throw error;
      return data as DailyPlan[];
    },
    enabled: !!user?.id,
  });

  const todayPlan = plans?.find(p => {
    const today = new Date().toISOString().split("T")[0];
    return p.plan_date === today;
  });

  const createPlan = useMutation({
    mutationFn: async (plan: Omit<DailyPlanInsert, "user_id">) => {
      if (!user?.id) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("daily_plans")
        .insert({ ...plan, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_plans", user?.id] });
    },
  });

  const updatePlan = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DailyPlan> & { id: string }) => {
      if (!user?.id) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("daily_plans")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_plans", user?.id] });
    },
  });

  return { plans: plans ?? [], todayPlan, isLoading, error, createPlan, updatePlan };
}
