import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Zap } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const [isRefreshing, setIsRefreshing] = useState(true);

    useEffect(() => {
        // Give the webhook time to process, then refresh profile data
        const timer = setTimeout(() => {
            if (user) {
                queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
            }
            setIsRefreshing(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, [user, queryClient]);

    return (
        <Layout>
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="max-w-md w-full text-center p-8">
                    <div className="mb-6">
                        <div className="w-20 h-20 mx-auto rounded-full bg-success/20 flex items-center justify-center mb-4">
                            <CheckCircle className="w-10 h-10 text-success" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
                        <p className="text-muted-foreground">
                            Thank you for your purchase. Your tokens are being credited to your account.
                        </p>
                    </div>

                    {isRefreshing ? (
                        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processing your tokens...</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2 text-success mb-6">
                            <Zap className="w-4 h-4" />
                            <span>Tokens credited successfully!</span>
                        </div>
                    )}

                    <div className="space-y-3">
                        <Button
                            variant="hero"
                            className="w-full"
                            onClick={() => navigate("/dashboard")}
                        >
                            Go to Dashboard
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => navigate("/payment-history")}
                        >
                            View Payment History
                        </Button>
                    </div>

                    <p className="text-xs text-muted-foreground mt-6">
                        If your tokens don't appear within 5 minutes, please contact support.
                    </p>
                </div>
            </div>
        </Layout>
    );
}
