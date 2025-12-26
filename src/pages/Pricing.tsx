import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TokenDisplay } from "@/components/shared/TokenDisplay";
import { Check, Zap, Star, Rocket, Clock, Gift, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useTokens } from "@/hooks/useTokens";

const plans = [
  {
    id: "free",
    name: "Starter",
    price: 0,
    tokens: 5,
    description: "Get started with basic execution tools",
    features: [
      "5 free tokens once",
      "Path Feasibility",
      "Problem Decomposer",
      "Basic Roadmap",
      "Study Optimizer",
    ],
    cta: "Get Started",
    variant: "outline" as const,
    popular: false,
    isPaid: false,
  },
  {
    id: "pack_25",
    name: "Growth",
    price: 99,
    tokens: 25,
    description: "Perfect for a single project execution",
    features: [
      "25 tokens",
      "All Starter features",
      "Advanced Roadmaps",
      "Consistency Tracking",
      "Priority Support",
    ],
    cta: "Coming Soon",
    variant: "hero" as const,
    popular: true,
    isPaid: true,
  },
  {
    id: "pack_60",
    name: "Pro",
    price: 199,
    tokens: 60,
    description: "For serious students and high performers",
    features: [
      "60 tokens",
      "All Growth features",
      "Priority execution logic",
      "Custom optimization",
    ],
    cta: "Coming Soon",
    variant: "outline" as const,
    popular: false,
    isPaid: true,
  },
];

const tokenCosts = [
  { feature: "Path Feasibility", cost: 1 },
  { feature: "Problem Decomposer", cost: 1 },
  { feature: "Roadmap Builder", cost: 2 },
  { feature: "Study Optimizer", cost: 1 },
  { feature: "Skill Proof Generator", cost: 2 },
];

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { refetch: refetchTokens } = useTokens();
  const [promoCode, setPromoCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handlePlanClick = (plan: typeof plans[0]) => {
    if (plan.isPaid) {
      // Paid plans are coming soon - do nothing
      return;
    }

    // Free plan - redirect to dashboard or login
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/dashboard");
  };

  const handleRedeemPromoCode = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to redeem a promo code",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!promoCode.trim()) {
      toast({
        title: "Enter Code",
        description: "Please enter a promo code",
        variant: "destructive",
      });
      return;
    }

    setIsRedeeming(true);

    try {
      const { data, error } = await supabase.functions.invoke("redeem-promo-code", {
        body: { code: promoCode.trim() },
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "Invalid Code",
          description: data.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success! 🎉",
          description: data.message,
        });
        setPromoCode("");
        refetchTokens();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to redeem promo code",
        variant: "destructive",
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Simple Token Pricing</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Pay for <span className="gradient-text">Execution</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              No subscriptions to forget. Buy tokens, use them when you need.
            </p>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-6 rounded-2xl border ${plan.popular
                  ? "card-gradient border-primary/50 shadow-lg shadow-primary/10"
                  : "bg-card border-border"
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3" /> Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    {plan.price === 0 ? (
                      <span className="text-4xl font-bold">Free</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold">₹{plan.price}</span>
                        <span className="text-muted-foreground"> one-time</span>
                      </>
                    )}
                  </div>
                  <TokenDisplay tokens={plan.tokens} size="sm" />
                  <p className="text-sm text-muted-foreground mt-3">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-success flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.variant}
                  className="w-full"
                  onClick={() => handlePlanClick(plan)}
                  disabled={plan.isPaid}
                >
                  {plan.isPaid ? (
                    <>
                      <Clock className="w-4 h-4 mr-2" />
                      Coming Soon
                    </>
                  ) : (
                    plan.cta
                  )}
                </Button>
              </div>
            ))}
          </div>

          {/* Token Costs */}
          <div className="max-w-2xl mx-auto">
            <div className="p-8 rounded-2xl card-gradient border border-border">
              <h2 className="text-2xl font-bold text-center mb-6">Token Costs</h2>
              <div className="space-y-3">
                {tokenCosts.map((item) => (
                  <div key={item.feature} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <span className="font-medium">{item.feature}</span>
                    <span className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="font-mono font-bold">{item.cost}</span>
                      <span className="text-muted-foreground text-sm">token{item.cost > 1 ? 's' : ''}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo Code Section */}
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-primary/10 border border-purple-500/30">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Gift className="w-6 h-6 text-purple-500" />
                <h3 className="text-lg font-semibold">Have a Promo Code?</h3>
              </div>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Enter your promo code to get bonus tokens!
              </p>
              <div className="flex gap-2 max-w-sm mx-auto">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="flex-1 text-center font-semibold tracking-wider uppercase"
                  disabled={isRedeeming}
                  onKeyDown={(e) => e.key === 'Enter' && handleRedeemPromoCode()}
                />
                <Button
                  variant="hero"
                  onClick={handleRedeemPromoCode}
                  disabled={isRedeeming || !promoCode.trim()}
                >
                  {isRedeeming ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Redeem"
                  )}
                </Button>
              </div>
            </div>

            {/* Coming Soon Notice */}
            <div className="mt-8 p-6 rounded-xl bg-primary/10 border border-primary/30 text-center">
              <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Payment Gateway Coming Soon</h3>
              <p className="text-sm text-muted-foreground">
                We're working on integrating our payment system. Stay tuned for updates!
                You can still use your free tokens to explore all features.
              </p>
            </div>

            {/* Bonus */}
            <div className="mt-8 p-6 rounded-xl bg-success/10 border border-success/30 text-center">
              <Rocket className="w-8 h-8 text-success mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Complete Milestones, Earn Tokens</h3>
              <p className="text-sm text-muted-foreground">
                When you complete a milestone in your roadmap, you get 1 token refunded.
                Execution rewards execution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
