import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";

export function ReflectiveFeedback() {
    const { user } = useAuth();
    const { profile } = useProfile();
    const [step, setStep] = useState<"initial" | "followup" | "submitted">("initial");
    const [selection, setSelection] = useState<string | null>(null);
    const [followupText, setFollowupText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Only show if user is logged in
    if (!user) return null;

    const options = ["Good", "Very good", "Excellent", "Something felt off"];

    const handleSelection = (option: string) => {
        setSelection(option);
        setStep("followup");
    };

    const handleSubmit = async () => {
        if (!selection) return;

        setIsSubmitting(true);

        const flagMap: Record<string, string> = {
            "Good": "good",
            "Very good": "very_good",
            "Excellent": "excellent",
            "Something felt off": "issue"
        };

        const flag = flagMap[selection];

        try {
            const { error } = await (supabase.from("user_feedback") as any).insert({
                user_id: user.id,
                user_name: profile?.full_name || user.email || "Student",
                avatar_url: profile?.avatar_url || null,
                feature: "roadmap",
                flag: flag,
                feedback_text: followupText || null,
                eligible_for_testimonial: false,
                show_in_testimonial: false
            });

            if (error) throw error;
        } catch (error) {
            console.error("Feedback error:", error);
            // Silent failure as per requirements
        } finally {
            setIsSubmitting(false);
            setStep("submitted");
        }
    };

    if (step === "submitted") {
        return (
            <div className="mt-12 mb-8 p-6 text-center animate-fade-in">
                <p className="text-muted-foreground italic">Thank you for sharing your thoughts.</p>
            </div>
        );
    }

    return (
        <div className="mt-16 mb-12 max-w-2xl mx-auto border-t border-border/50 pt-12 animate-fade-in">
            <div className="space-y-6">
                <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Reflection</h4>
                    <p className="text-lg font-medium text-foreground">
                        {step === "initial"
                            ? "Does this path feel manageable to you?"
                            : selection === "Something felt off"
                                ? "Which part felt unclear or unrealistic to you?"
                                : "What part of this plan felt most helpful?"
                        }
                    </p>
                </div>

                {step === "initial" ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {options.map((option) => (
                            <Button
                                key={option}
                                variant="outline"
                                className="h-auto py-3 px-4 text-sm font-normal border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all"
                                onClick={() => handleSelection(option)}
                            >
                                {option}
                            </Button>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4 animate-slide-up">
                        <Textarea
                            placeholder="Your thoughts..."
                            className="min-h-[100px] bg-secondary/20 border-border/60 focus:border-primary/40 resize-none pt-4"
                            value={followupText}
                            onChange={(e) => setFollowupText(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <Button
                                variant="hero"
                                size="sm"
                                onClick={handleSubmit}
                                className="px-8"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Sending..." : "Send reflection"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
