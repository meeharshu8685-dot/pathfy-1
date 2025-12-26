import { Layout } from "@/components/layout/Layout";
import { Testimonials } from "@/components/home/Testimonials";
import { Star, MessageSquare } from "lucide-react";

export default function TestimonialsPage() {
    return (
        <Layout>
            <div className="pt-20 pb-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-medium">User Success Stories</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold font-display mb-6">
                            Wall of <span className="text-gradient-animate">Love</span>
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            See how students and professionals are using Pathfy to turn their ambitious goals into reality.
                        </p>
                    </div>

                    <Testimonials />

                    <div className="mt-20 max-w-2xl mx-auto p-8 rounded-3xl bg-secondary/30 border border-border text-center">
                        <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
                        <h2 className="text-2xl font-bold mb-4">Have your own success story?</h2>
                        <p className="text-muted-foreground mb-6">
                            We'd love to hear how Pathfy has helped you achieve your goals. Your feedback helps us build a better tool for everyone.
                        </p>
                        <a
                            href="mailto:support@pathfy.com?subject=Success Story"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                        >
                            Share Your Story
                        </a>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
