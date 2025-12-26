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
            <DialogContent className="sm:max-w-md bg-background border-border">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Review Your Experience</DialogTitle>
                    <DialogDescription>
                        We'd love to hear how Pathfy has helped you!
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className="transition-transform active:scale-95"
                                >
                                    <Star
                                        className={`w-8 h-8 ${star <= rating
                                                ? "fill-primary text-primary"
                                                : "text-muted-foreground/30"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Your Role / Headline</label>
                        <Input
                            placeholder="e.g. Student, SDE, Project Manager"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="bg-secondary/50 border-border"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Your Review</label>
                        <Textarea
                            placeholder="Tell us about your success story or feedback..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="min-h-[120px] bg-secondary/50 border-border"
                        />
                    </div>
                </div>

                <DialogFooter className="flex gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-primary text-primary-foreground hover:opacity-90"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
