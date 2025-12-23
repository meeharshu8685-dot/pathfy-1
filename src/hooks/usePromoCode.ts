import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export function usePromoCode() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isRedeeming, setIsRedeeming] = useState(false);

  const redeemCode = async (code: string): Promise<{ success: boolean; tokensReceived?: number }> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to redeem a promo code.",
        variant: "destructive",
      });
      return { success: false };
    }

    if (!code.trim()) {
      toast({
        title: "Invalid Code",
        description: "Please enter a promo code.",
        variant: "destructive",
      });
      return { success: false };
    }

    setIsRedeeming(true);

    try {
      const { data, error } = await supabase.functions.invoke("redeem-promo-code", {
        body: { code: code.trim() },
      });

      if (error) {
        throw new Error(error.message || "Failed to redeem code");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Promo Code Redeemed!",
        description: data.message,
      });

      // Refresh profile to update token count
      queryClient.invalidateQueries({ queryKey: ["profile", user.id] });

      return { success: true, tokensReceived: data.tokensReceived };
    } catch (err: any) {
      toast({
        title: "Redemption Failed",
        description: err.message || "Failed to redeem promo code.",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsRedeeming(false);
    }
  };

  return { redeemCode, isRedeeming };
}
