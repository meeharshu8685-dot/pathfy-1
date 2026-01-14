import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/shared/FeatureCard";
import { Link } from "react-router-dom";
import { SplashScreen } from "@/components/splash/SplashScreen";
import {
  Target,
  Puzzle,
  Map,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Zap
} from "lucide-react";

const features = [
  {
    icon: <Target className="w-6 h-6" />,
    title: "Path Feasibility",
    description: "Validate if your goal is actually achievable given your constraints. No more wishful thinking.",
    href: "/reality-check",
    tokenCost: 1,
  },
  {
    icon: <Puzzle className="w-6 h-6" />,
    title: "Problem Decomposer",
    description: "Convert vague goals into atomic, unblockable tasks. Each task ≤ 90 minutes.",
    href: "/problem-decomposer",
    tokenCost: 1,
  },
  {
    icon: <Map className="w-6 h-6" />,
    title: "Roadmap Builder",
    description: "Create a dependency-locked execution path. No task starts before its prerequisites.",
    href: "/roadmap",
    tokenCost: 2,
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Study Optimizer",
    description: "Decide what to do TODAY based on available time and focus level. Not in theory.",
    href: "/study-optimizer",
    tokenCost: 1,
  },
];

const antiPatterns = [
  "Give generic advice",
  "Suggest parallel learning",
  "Assume unlimited time",
  "Hallucinate timelines",
  "Enable fake productivity",
];

const proPatterns = [
  "Be conservative, not optimistic",
  "Reject unrealistic goals",
  "Enforce correct learning order",
  "Optimize for execution",
  "Produce structured outputs",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    // Check if splash was already shown this session
    const splashShown = sessionStorage.getItem("splashShown");
    if (splashShown) {
      setShowSplash(false);
      setContentVisible(true);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem("splashShown", "true");
    setShowSplash(false);
    // Slight delay before showing content for smooth transition
    setTimeout(() => setContentVisible(true), 100);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      <Layout>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center hero-glow overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
              className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl"
            />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="max-w-4xl mx-auto text-center"
            >
              {/* Badge */}
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 backdrop-blur-sm border border-border mb-8"
              >
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Execution Intelligence Engine</span>
              </motion.div>

              {/* Main heading */}
              <motion.h1
                variants={itemVariants}
                className="text-3xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
              >
                <span className="block">Stop Planning.</span>
                <span className="block mt-2 text-gradient-animate">Start Executing.</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                variants={itemVariants}
                className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              >
                Convert goals into realistic, dependency-aware, time-bounded execution systems.
                Built for students and early professionals who want results, not excuses.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link to="/reality-check">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto group">
                    Check Your Path
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="glass" size="xl" className="w-full sm:w-auto">
                    View Dashboard
                  </Button>
                </Link>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                variants={itemVariants}
                className="mt-16 sm:mt-20"
              >
                <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
                  <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
                  <div className="w-6 h-10 rounded-full border-2 border-current flex justify-center pt-2">
                    <motion.div
                      animate={{ y: [0, 8, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="w-1.5 h-3 bg-current rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Anti-Patterns Section */}
        <section className="py-12 md:py-20 border-t border-border overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="text-center mb-12"
            >
              <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold font-display mb-4"
              >
                We're Different
              </motion.h2>
              <motion.p variants={itemVariants} className="text-muted-foreground max-w-xl mx-auto">
                Most productivity tools enable procrastination disguised as planning. We don't.
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
              {/* What We Don't Do */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="p-6 sm:p-8 rounded-2xl bg-destructive/5 border border-destructive/20 hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-destructive">
                  <XCircle className="w-5 h-5" />
                  We Never
                </h3>
                <ul className="space-y-3">
                  {antiPatterns.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <span className="text-destructive mt-0.5 font-medium">✗</span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* What We Do */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="p-6 sm:p-8 rounded-2xl bg-success/5 border border-success/20 hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-success">
                  <CheckCircle2 className="w-5 h-5" />
                  We Always
                </h3>
                <ul className="space-y-3">
                  {proPatterns.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <span className="text-success mt-0.5 font-medium">✓</span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-20 border-t border-border">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="text-center mb-12"
            >
              <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold font-display mb-4">Execution Tools</motion.h2>
              <motion.p variants={itemVariants} className="text-muted-foreground max-w-xl mx-auto">
                Each tool uses the same AI with different execution instructions. Pay only for what
                you use.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.href}
                  variants={itemVariants}
                >
                  <FeatureCard {...feature} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-20 border-t border-border">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl mx-auto text-center p-8 sm:p-12 rounded-3xl card-gradient border border-border relative overflow-hidden"
            >
              {/* Animated glow */}
              <div className="absolute inset-0 hero-glow opacity-50" />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, delay: 2, repeat: Infinity }}
                className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/20 rounded-full blur-3xl"
              />

              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
                  Ready to Execute?
                </h2>
                <p className="text-muted-foreground mb-8">
                  Start with 5 free tokens. No credit card required.
                </p>
                <Link to="/reality-check">
                  <Button variant="hero" size="xl" className="group">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
}