import { useState, useEffect } from "react";
import { Share2, MessageCircle, Twitter, Linkedin, Copy, Check, Gift, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

const SHARE_URL = "https://pathly-executor.vercel.app/";
const SHARE_TEXT = "Build a realistic roadmap for your goals with Pathfy. 🚀";

export function ShareEarnSection() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isSharing, setIsSharing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [shareCount, setShareCount] = useState(0);

    // Fetch current share count from profile
    useEffect(() => {
        if (user) {
            const getShareCount = async () => {
                const { data } = await supabase
                    .from("profiles")
                    .select("share_count")
                    .eq("user_id", user.id)
                    .single();
                if (data) setShareCount(data.share_count || 0);
            };
            getShareCount();
        }
    }, [user]);

    const handleShare = async (platform: string) => {
        if (!user) {
            toast({
                title: "Login Required",
                description: "Please login to earn tokens for sharing.",
                variant: "destructive",
            });
            return;
        }

        setIsSharing(true);
        let url = "";

        switch (platform) {
            case "whatsapp":
                url = `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + " " + SHARE_URL)}`;
                break;
            case "twitter":
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}`;
                break;
            case "linkedin":
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`;
                break;
            case "copy":
                navigator.clipboard.writeText(`${SHARE_TEXT} ${SHARE_URL}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                break;
            case "native":
                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: "Pathfy",
                            text: SHARE_TEXT,
                            url: SHARE_URL,
                        });
                    } catch (err) {
                        console.log("Share canceled or failed", err);
                        setIsSharing(false);
                        return;
                    }
                }
                break;
        }

        if (platform !== "copy" && platform !== "native") {
            window.open(url, "_blank");
        }

        try {
            const { data, error } = await supabase.functions.invoke("track-share", {
                body: { platform },
            });

            if (error) throw error;

            if (data.success || data.message) {
                toast({
                    title: "Tokens Earned! 🪙",
                    description: data.message,
                });
                setShareCount(data.share_count);
                queryClient.invalidateQueries({ queryKey: ["profile"] });
            }
        } catch (error: any) {
            console.error("Share tracking error", error);
            toast({
                title: "Heads up!",
                description: "Share recorded, but token update failed. Contact support if needed.",
                variant: "default",
            });
        } finally {
            setIsSharing(false);
        }
    };

    const nextMilestone = 5 - (shareCount % 5);
    const progress = ((shareCount % 5) / 5) * 100;

    return (
        <div className="mt-8 p-6 rounded-2xl border border-primary/20 bg-primary/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Share2 className="w-24 h-24 rotate-12" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-bold">Refer & Earn Tokens</h3>
                </div>
                <p className="text-muted-foreground text-sm mb-6 max-w-md">
                    Help others execute their goals. Earn <span className="text-primary font-bold">2 tokens</span> per share +
                    <span className="text-primary font-bold"> 10 bonus tokens</span> every 5 shares!
                </p>

                {/* Bonus Progress */}
                <div className="mb-8 space-y-2">
                    <div className="flex justify-between text-xs font-medium mb-1">
                        <span className="text-primary flex items-center gap-1">
                            <Zap className="w-3 h-3" /> {shareCount % 5} / 5 Shares
                        </span>
                        <span className="text-muted-foreground">{nextMilestone} more for 10 bonus tokens</span>
                    </div>
                    <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500 ease-out shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Share Actions */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 hover:bg-success/10 hover:text-success hover:border-success/30 transition-all"
                        onClick={() => handleShare("whatsapp")}
                        disabled={isSharing}
                    >
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 hover:bg-blue-400/10 hover:text-blue-400 hover:border-blue-400/30 transition-all"
                        onClick={() => handleShare("twitter")}
                        disabled={isSharing}
                    >
                        <Twitter className="w-4 h-4" /> Twitter
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 hover:bg-blue-600/10 hover:text-blue-600 hover:border-blue-600/30 transition-all"
                        onClick={() => handleShare("linkedin")}
                        disabled={isSharing}
                    >
                        <Linkedin className="w-4 h-4" /> LinkedIn
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleShare("copy")}
                        disabled={isSharing}
                    >
                        {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied" : "Copy Link"}
                    </Button>
                </div>

                {navigator.share && (
                    <Button
                        variant="hero"
                        className="w-full mt-4 gap-2"
                        onClick={() => handleShare("native")}
                        disabled={isSharing}
                    >
                        {isSharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                        Quick Share
                    </Button>
                )}
            </div>
        </div>
    );
}
