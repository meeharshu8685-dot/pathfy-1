import { Star, Quote, User } from "lucide-react";

interface Testimonial {
    name: string;
    role: string;
    content: string;
    rating: number;
    avatar?: string;
}

const testimonials: Testimonial[] = [
    {
        name: "Arjun Mehta",
        role: "Final Year CSE, IIT Delhi",
        content: "Pathfy changed how I look at my goals. Instead of just wishing to become a MERN stack dev, I now have a day-by-day roadmap that actually accounts for my college hours.",
        rating: 5,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun"
    },
    {
        name: "Ananya Iyer",
        role: "Data Science Aspirant",
        content: "The Reality Check feature is a wake-up call. It told me my 3-month goal was unrealistic given my schedule, and helped me adjust to a 6-month path that I'm actually sticking to.",
        rating: 5,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya"
    },
    {
        name: "Rohan Varma",
        role: "Junior SDE at Zoho",
        content: "The Decomposer tool is legendary. It breaks down complex cloud architecture topics into manageable 90-minute blocks. My productivity has doubled.",
        rating: 5,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan"
    },
    {
        name: "Ishita Kapoor",
        role: "Product Design Student",
        content: "I love the Study Optimizer. On days when I'm exhausted, it gives me low-effort tasks that still move the needle. No more 'all or nothing' thinking.",
        rating: 4,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ishita"
    }
];

export function Testimonials() {
    return (
        <section className="py-20 border-t border-border bg-secondary/5 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight mb-4">
                        Trusted by <span className="gradient-text">High Performers</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Real feedback from students and professionals who transitioned from planning to execution.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {testimonials.filter(t => t.content && t.content.trim().length > 0).map((t, i) => (
                        <div
                            key={i}
                            className="p-6 rounded-2xl card-gradient border border-border flex flex-col justify-between hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 group"
                        >
                            <div>
                                <div className="flex gap-1 mb-4 text-primary">
                                    {[...Array(t.rating)].map((_, j) => (
                                        <Star key={j} className="w-4 h-4 fill-current" />
                                    ))}
                                    {t.rating < 5 && <Star className="w-4 h-4 text-muted-foreground/30" />}
                                </div>
                                <div className="relative">
                                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/10 -z-10 group-hover:text-primary/20 transition-colors" />
                                    <p className="text-muted-foreground leading-relaxed mb-6 italic">
                                        "{t.content}"
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden">
                                    {t.avatar ? (
                                        <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-5 h-5 text-primary" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground text-sm">{t.name}</h4>
                                    <p className="text-xs text-muted-foreground">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
