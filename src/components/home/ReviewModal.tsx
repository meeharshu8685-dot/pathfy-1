import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [role, setRole] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async () => {
        if (!comment.trim()) {
            toast({
                title: "Feedback required",
                description: "Please share some details about your experience.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast({
                    title: "Authentication required",
                    description: "Please log in to leave a review.",
                    variant: "destructive",
                });
                return;
            }

            const { error } = await supabase.from("user_feedback").insert({
                user_id: user.id,
                user_name: user.user_metadata.full_name || user.email?.split("@")[0] || "User",
                avatar_url: user.user_metadata.avatar_url || null,
                rating,
                role: role || "Pathfy User",
                feedback_text: comment,
                feature: "General Review",
                flag: rating >= 4 ? "excellent" : rating >= 3 ? "very_good" : "good",
                eligible_for_testimonial: rating >= 4,
            });

            if (error) throw error;

            toast({
                title: "Review submitted",
                description: "Thank you for your feedback! It helps us improve.",
            });
            onClose();
            setComment("");
            setRole("");
            setRating(5);
        } catch (error: any) {
            toast({
                title: "Error submitting review",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="fixed left-1/2 top-4 md:top-8 z-50 w-[92vw] max-w-lg -translate-x-1/2 p-0 bg-background border-border overflow-hidden rounded-[2rem] shadow-2xl transition-all"
            >
                <div className="max-h-[85vh] overflow-y-auto outline-none p-6 md:p-8">
                    <DialogHeader className="mb-8 text-left">
                        <DialogTitle className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                            Review Your <span className="text-primary">Experience</span>
                        </DialogTitle>
                        <DialogDescription className="text-base text-muted-foreground mt-2">
                            We'd love to hear how Pathfy has helped you achieve your goals!
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-8 pb-4">
                        <div className="space-y-3">
                            <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
                                How would you rate us?
                            </label>
                            <div className="flex gap-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className="transform transition-all active:scale-90 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-full"
                                        aria-label={`Rate ${star} stars`}
                                    >
                                        <Star
                                            className={`w-10 h-10 ${star <= rating
                                                ? "fill-primary text-primary drop-shadow-[0_0_8px_rgba(124,58,237,0.3)]"
                                                : "text-muted-foreground/20"
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="role-input" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
                                Your Role / Headline
                            </label>
                            <Input
                                id="role-input"
                                placeholder="e.g. Student, SDE, Project Manager"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="h-12 bg-secondary/30 border-border/50 focus:bg-secondary/50 transition-colors rounded-xl font-medium"
                            />
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="review-text" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
                                Your Review
                            </label>
                            <Textarea
                                id="review-text"
                                placeholder="Share your success story or feedback with the community..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="min-h-[140px] bg-secondary/30 border-border/50 focus:bg-secondary/50 transition-colors rounded-xl resize-none py-4 font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border mt-4">
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 h-12 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isSubmitting ? "Submitting..." : "Post Review"}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="h-12 text-muted-foreground font-medium rounded-xl hover:bg-secondary/50"
                        >
                            Maybe Later
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
