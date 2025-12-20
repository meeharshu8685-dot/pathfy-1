import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { TokenDisplay } from "@/components/shared/TokenDisplay";
import { Check, Zap, Star, Rocket } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    tokens: 5,
    description: "Get started with basic execution tools",
    features: [
      "5 free tokens/month",
      "Reality Check",
      "Problem Decomposer",
      "Basic Roadmap",
      "Study Optimizer",
    ],
    cta: "Get Started",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    tokens: 50,
    description: "For serious students and professionals",
    features: [
      "50 tokens/month",
      "All Starter features",
      "Advanced Roadmaps",
      "Consistency Tracking",
      "Failure Detection",
      "Priority Support",
    ],
    cta: "Start Pro Trial",
    variant: "hero" as const,
    popular: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/month",
    tokens: 200,
    description: "For study groups and bootcamps",
    features: [
      "200 tokens/month",
      "All Pro features",
      "Team Dashboard",
      "Progress Sharing",
      "Admin Controls",
      "Slack Integration",
    ],
    cta: "Contact Sales",
    variant: "outline" as const,
    popular: false,
  },
];

const tokenCosts = [
  { feature: "Reality Check", cost: 1 },
  { feature: "Problem Decomposer", cost: 1 },
  { feature: "Roadmap Builder", cost: 2 },
  { feature: "Study Optimizer", cost: 1 },
  { feature: "Skill Proof Generator", cost: 2 },
];

export default function Pricing() {
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
                className={`relative p-6 rounded-2xl border ${
                  plan.popular
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
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
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

                <Button variant={plan.variant} className="w-full">
                  {plan.cta}
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
