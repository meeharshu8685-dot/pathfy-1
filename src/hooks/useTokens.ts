import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "./useProfile";
import { toast } from "@/hooks/use-toast";

export function useTokens() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  const currentTokens = profile?.tokens ?? 0;

  const spendTokens = useMutation({
    mutationFn: async ({ amount, feature, description }: { 
      amount: number; 
      feature: string; 
      description: string 
    }) => {
      if (!user?.id) throw new Error("Not authenticated");
      if (currentTokens < amount) throw new Error("Insufficient tokens");

      const newBalance = currentTokens - amount;

      // Update profile tokens
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ tokens: newBalance })
        .eq("user_id", user.id);

      if (profileError) throw profileError;

      // Record transaction
      const { error: transactionError } = await supabase
        .from("token_transactions")
        .insert({
          user_id: user.id,
          amount: -amount,
          balance_after: newBalance,
          transaction_type: "debit",
          feature_used: feature,
          description,
        });

      if (transactionError) throw transactionError;

      return newBalance;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
    onError: (error) => {
      toast({
        title: "Token Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addTokens = useMutation({
    mutationFn: async ({ amount, description }: { amount: number; description: string }) => {
      if (!user?.id) throw new Error("Not authenticated");

      const newBalance = currentTokens + amount;

      // Update profile tokens
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ tokens: newBalance })
        .eq("user_id", user.id);

      if (profileError) throw profileError;

      // Record transaction
      const { error: transactionError } = await supabase
        .from("token_transactions")
        .insert({
          user_id: user.id,
          amount,
          balance_after: newBalance,
          transaction_type: "credit",
          description,
        });

      if (transactionError) throw transactionError;

      return newBalance;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
  });

  const canAfford = (amount: number) => currentTokens >= amount;

  return { 
    tokens: currentTokens, 
    spendTokens, 
    addTokens, 
    canAfford,
    isSpending: spendTokens.isPending 
  };
}
