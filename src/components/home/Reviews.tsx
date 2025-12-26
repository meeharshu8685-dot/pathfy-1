import { Star, Quote, User } from "lucide-react";

interface Review {
    name: string;
    role: string;
    content: string;
    rating: number;
}

const reviews: Review[] = [
    {
        name: "Arjun Mehta",
        role: "Final Year CSE, IIT Delhi",
        content: "Pathfy changed how I look at my goals. Instead of just wishing to become a MERN stack dev, I now have a day-by-day roadmap that actually accounts for my college hours.",
        rating: 5
    },
    {
        name: "Ananya Iyer",
        role: "Data Science Aspirant",
        content: "The Reality Check feature is a wake-up call. It told me my 3-month goal was unrealistic given my schedule, and helped me adjust to a 6-month path that I'm actually sticking to.",
        rating: 5
    },
    {
        name: "Rohan Varma",
        role: "Junior SDE at Zoho",
        content: "The Decomposer tool is legendary. It breaks down complex cloud architecture topics into manageable 90-minute blocks. My productivity has doubled.",
        rating: 5
    },
    {
        name: "Ishita Kapoor",
        role: "Product Design Student",
        content: "I love the Study Optimizer. On days when I'm exhausted, it gives me low-effort tasks that still move the needle. No more 'all or nothing' thinking.",
        rating: 4
    },
    {
        name: "Shahih Shah",
        role: "Full Stack Developer",
        content: "The dependency-locked roadmap is a game changer. I used to jump between technologies without finishing the basics. Now, Pathfy keeps me on the right track until I'm actually ready to move on.",
        rating: 5
    },
    {
        name: "Irfan Khan",
        role: "Govt Exam Aspirant",
        content: "Managing a huge syllabus like UPSC felt impossible until I used the Decomposer. It turned terrifying subjects into small, 90-minute wins. Highly recommended for any serious aspirant.",
        rating: 5
    },
    {
        name: "Suresh Pillai",
        role: "Mechanical Engineer",
        content: "It's a decent tool, but the learning curve for the roadmap builder was a bit steep for me. Once I got the hang of it, it became useful, but the initial onboarding could be simpler.",
        rating: 3
    },
    {
        name: "Pooja Sharma",
        role: "Freelance Content Writer",
        content: "The AI analysis is sometimes a bit too conservative. It told me my goal was impossible even when I knew I could hustle more. Good for reality, but maybe a bit too discouraging sometimes.",
        rating: 3
    },
    {
        name: "Vikram Singh",
        role: "Commerce Student",
        content: "I found the UI a bit overwhelming initially with so many different tools. I just wanted a simple to-do list, which this isn't. It's powerful, but maybe too much for casual planning.",
        rating: 2
    }
];

export function Reviews() {
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
                    {reviews.map((t, i) => (
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

                            <div className="pt-4 border-t border-border/50">
                                <h4 className="font-bold text-foreground text-sm">{t.name}</h4>
                                <p className="text-xs text-muted-foreground">{t.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
