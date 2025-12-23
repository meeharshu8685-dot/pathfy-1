import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Zap, ArrowUpRight, ArrowDownRight, Receipt, Loader2 } from "lucide-react";
import { TokenDisplay } from "@/components/shared/TokenDisplay";
import { useProfile } from "@/hooks/useProfile";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface TokenTransaction {
  id: string;
  amount: number;
  balance_after: number;
  transaction_type: string;
  feature_used: string | null;
  description: string;
  created_at: string;
}

export default function PaymentHistory() {
  const { user, isLoading: authLoading } = useAuth();
  const { profile } = useProfile();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["token-transactions", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("token_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as TokenTransaction[];
    },
    enabled: !!user?.id,
  });

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const credits = transactions?.filter(t => t.transaction_type === "credit") || [];
  const debits = transactions?.filter(t => t.transaction_type === "debit") || [];
  const totalEarned = credits.reduce((sum, t) => sum + t.amount, 0);
  const totalSpent = debits.reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Payment History</h1>
            </div>
            <p className="text-muted-foreground">
              View all your token transactions and purchases
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="p-6 rounded-2xl card-gradient border border-border">
              <p className="text-sm text-muted-foreground mb-2">Current Balance</p>
              <TokenDisplay tokens={profile?.tokens ?? 0} size="lg" />
            </div>
            <div className="p-6 rounded-2xl bg-success/10 border border-success/30">
              <p className="text-sm text-muted-foreground mb-2">Total Earned</p>
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-success" />
                <span className="text-2xl font-bold text-success">+{totalEarned}</span>
                <span className="text-muted-foreground">tokens</span>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/30">
              <p className="text-sm text-muted-foreground mb-2">Total Spent</p>
              <div className="flex items-center gap-2">
                <ArrowDownRight className="w-5 h-5 text-destructive" />
                <span className="text-2xl font-bold text-destructive">-{totalSpent}</span>
                <span className="text-muted-foreground">tokens</span>
              </div>
            </div>
          </div>

          {/* Buy More Tokens */}
          <div className="mb-8">
            <Link to="/pricing">
              <Button variant="hero" className="gap-2">
                <Zap className="w-4 h-4" />
                Buy More Tokens
              </Button>
            </Link>
          </div>

          {/* Transactions List */}
          <div className="rounded-2xl card-gradient border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold">All Transactions</h2>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : transactions?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No transactions yet</p>
                <p className="text-sm mt-1">Purchase tokens to get started</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {transactions?.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.transaction_type === "credit"
                            ? "bg-success/10"
                            : "bg-destructive/10"
                        }`}
                      >
                        {transaction.transaction_type === "credit" ? (
                          <ArrowUpRight className="w-5 h-5 text-success" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(transaction.created_at), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-mono font-bold ${
                          transaction.transaction_type === "credit"
                            ? "text-success"
                            : "text-destructive"
                        }`}
                      >
                        {transaction.transaction_type === "credit" ? "+" : ""}
                        {transaction.amount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Balance: {transaction.balance_after}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
