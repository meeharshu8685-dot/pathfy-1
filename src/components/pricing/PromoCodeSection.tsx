import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Loader2, Check } from "lucide-react";
import { usePromoCode } from "@/hooks/usePromoCode";
import { useAuth } from "@/contexts/AuthContext";

export function PromoCodeSection() {
  const { user } = useAuth();
  const { redeemCode, isRedeeming } = usePromoCode();
  const [code, setCode] = useState("");
  const [redeemed, setRedeemed] = useState(false);
  const [tokensReceived, setTokensReceived] = useState<number | null>(null);

  const handleRedeem = async () => {
    const result = await redeemCode(code);
    if (result.success) {
      setRedeemed(true);
      setTokensReceived(result.tokensReceived || 0);
      setCode("");
      // Reset after 3 seconds
      setTimeout(() => {
        setRedeemed(false);
        setTokensReceived(null);
      }, 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && code.trim() && !isRedeeming) {
      handleRedeem();
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-orange-500/5 border border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Gift className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Have a Promo Code?</h3>
          <p className="text-sm text-muted-foreground">
            Enter your code to get free tokens
          </p>
        </div>
      </div>

      {redeemed ? (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-success/10 border border-success/30">
          <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
            <Check className="w-4 h-4 text-success" />
          </div>
          <div>
            <p className="font-medium text-success">Code Redeemed!</p>
            <p className="text-sm text-muted-foreground">
              You received {tokensReceived} tokens
            </p>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            placeholder={user ? "Enter promo code" : "Sign in to redeem"}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            disabled={!user || isRedeeming}
            className="font-mono uppercase"
          />
          <Button
            onClick={handleRedeem}
            disabled={!user || !code.trim() || isRedeeming}
            className="shrink-0"
          >
            {isRedeeming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Redeem"
            )}
          </Button>
        </div>
      )}

      {!user && (
        <p className="text-xs text-muted-foreground mt-2">
          Please sign in to redeem promo codes
        </p>
      )}
    </div>
  );
}
