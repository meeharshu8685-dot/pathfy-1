import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Star, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ReviewPage() {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [role, setRole] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

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
            navigate("/reviews");
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
        <Layout>
            <div className="min-h-screen pt-20 pb-12 bg-background">
                <div className="container max-w-2xl mx-auto px-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/reviews")}
                        className="mb-8 hover:bg-secondary/50"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Reviews
                    </Button>

                    <div className="bg-secondary/20 border border-border rounded-3xl p-8 md:p-12 shadow-xl">
                        <div className="mb-10">
                            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                                Review Your <span className="text-primary">Experience</span>
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                We'd love to hear how Pathfy has helped you achieve your goals!
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
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
                                                className={`w-10 h-10 md:w-12 md:h-12 ${star <= rating
                                                    ? "fill-primary text-primary drop-shadow-[0_0_12px_rgba(124,58,237,0.3)]"
                                                    : "text-muted-foreground/20"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label htmlFor="role-input" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
                                    Your Role / Headline
                                </label>
                                <Input
                                    id="role-input"
                                    placeholder="e.g. Student, SDE, Project Manager"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="h-14 bg-background border-border/50 focus:bg-secondary/50 transition-colors rounded-2xl text-lg font-medium"
                                />
                            </div>

                            <div className="space-y-4">
                                <label htmlFor="review-text" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
                                    Your Review
                                </label>
                                <Textarea
                                    id="review-text"
                                    placeholder="Share your success story or feedback with the community..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="min-h-[200px] bg-background border-border/50 focus:bg-secondary/50 transition-colors rounded-2xl resize-none py-6 text-lg font-medium"
                                />
                            </div>

                            <div className="pt-4">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="w-full h-14 text-xl font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] bg-primary text-primary-foreground"
                                >
                                    {isSubmitting ? "Submitting..." : "Post Review"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
