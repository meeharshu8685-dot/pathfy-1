import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Receipt, Calendar, Zap, IndianRupee, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PaymentHistory() {
    const { user, isLoading: authLoading } = useAuth();

    const { data: transactions, isLoading: transactionsLoading } = useQuery({
        queryKey: ["payment-history", user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("payments")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            return (data as any) || [];
        },
        enabled: !!user,
    });

    if (authLoading) {
        return (
            <Layout>
                <div className="py-12 container mx-auto px-4 text-center">
                    <Skeleton className="h-10 w-48 mx-auto mb-8" />
                    <Skeleton className="h-64 w-full max-w-4xl mx-auto" />
                </div>
            </Layout>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <Layout>
            <div className="py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold font-display flex items-center gap-3">
                                <Receipt className="w-8 h-8 text-primary" />
                                Payment History
                            </h1>
                            <p className="text-muted-foreground">View your recent token purchases and transactions</p>
                        </div>
                        <Link to="/pricing">
                            <Button variant="outline" size="sm">
                                Get More Tokens
                            </Button>
                        </Link>
                    </div>

                    {transactionsLoading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-20 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : transactions && transactions.length > 0 ? (
                        <div className="space-y-4">
                            {(transactions as any[]).map((transaction: any) => (
                                <div
                                    key={transaction.id}
                                    className="p-5 rounded-xl card-gradient border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-primary/30"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Zap className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{transaction.token_amount} Tokens</h3>
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(transaction.created_at).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1.5 uppercase font-medium">
                                                    {transaction.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                                        <div className="text-xl font-bold flex items-center text-foreground">
                                            <IndianRupee className="w-4 h-4" />
                                            {transaction.amount}
                                        </div>
                                        <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">
                                            {transaction.payment_method || 'Card'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 px-4 rounded-2xl bg-secondary/20 border border-dashed border-border">
                            <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h2 className="text-xl font-semibold mb-2">No Transactions Yet</h2>
                            <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                                You haven't purchased any token packs yet. Once you make a purchase, it will appear here.
                            </p>
                            <Link to="/pricing">
                                <Button variant="hero">
                                    Explore Plans
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
