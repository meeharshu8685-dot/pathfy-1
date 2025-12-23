import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Plan {
  id: string;
  name: string;
  price: number;
  tokens: number;
}

export function useRazorpay() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async (plan: Plan) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to purchase tokens.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay SDK");
      }

      // Create order via edge function
      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: {
          planId: plan.id,
          amount: plan.price,
          tokens: plan.tokens,
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to create order");
      }

      const { orderId, amount, currency, keyId } = data;

      // Open Razorpay checkout
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "PathPilot",
        description: `${plan.name} - ${plan.tokens} Tokens`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              "verify-razorpay-payment",
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  tokens: plan.tokens,
                  planId: plan.id,
                  amount: plan.price,
                },
              }
            );

            if (verifyError) {
              throw new Error(verifyError.message || "Payment verification failed");
            }

            toast({
              title: "Payment Successful!",
              description: `${verifyData.tokens} tokens added to your account.`,
            });

            // Refresh profile to update token count
            queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
          } catch (err: any) {
            toast({
              title: "Verification Failed",
              description: err.message || "Please contact support.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response: any) => {
        toast({
          title: "Payment Failed",
          description: response.error.description || "Please try again.",
          variant: "destructive",
        });
      });

      razorpay.open();
    } catch (err: any) {
      console.error("Detailed Payment Error:", err);
      toast({
        title: "Payment Error",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return { initiatePayment, isProcessing };
}
