import { useState, useEffect } from "react";
import { Zap, Target, TrendingUp, Sparkles } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export function SplashScreen({ onComplete, duration = 3000 }: SplashScreenProps) {
  const [phase, setPhase] = useState<"init" | "logo" | "text" | "tagline" | "exit">("init");

  useEffect(() => {
    const initTimer = setTimeout(() => setPhase("logo"), 100);
    const logoTimer = setTimeout(() => setPhase("text"), 800);
    const taglineTimer = setTimeout(() => setPhase("tagline"), 1400);
    const exitTimer = setTimeout(() => setPhase("exit"), duration - 600);
    const completeTimer = setTimeout(onComplete, duration);

    return () => {
      clearTimeout(initTimer);
      clearTimeout(logoTimer);
      clearTimeout(taglineTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, duration]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden transition-all duration-700 ease-out ${phase === "exit" ? "opacity-0 scale-110" : "opacity-100 scale-100"
        }`}
    >
      {/* Advanced animated background */}
      <div className="absolute inset-0">
        {/* Main gradient orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
          <div
            className={`absolute inset-0 bg-gradient-conic from-primary/30 via-accent/20 via-purple-500/20 to-primary/30 rounded-full blur-3xl transition-all duration-[2000ms] ease-out ${phase !== "init" ? "scale-150 opacity-40 rotate-180" : "scale-50 opacity-0 rotate-0"
              }`}
            style={{ animation: phase !== "init" ? "spin 20s linear infinite" : "none" }}
          />
        </div>

        {/* Particle grid effect */}
        <div className="absolute inset-0 opacity-20">
          <div
            className={`w-full h-full transition-opacity duration-1000 ${phase !== "init" ? "opacity-100" : "opacity-0"
              }`}
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        {/* Floating orbs with advanced effects */}
        <div
          className={`absolute top-1/4 left-1/5 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl transition-all duration-1000 ${phase !== "init" ? "opacity-60 scale-100" : "opacity-0 scale-50"
            }`}
          style={{ animation: "float 6s ease-in-out infinite" }}
        />
        <div
          className={`absolute bottom-1/4 right-1/5 w-32 h-32 bg-gradient-to-tl from-accent/25 to-transparent rounded-full blur-2xl transition-all duration-1000 delay-200 ${phase !== "init" ? "opacity-60 scale-100" : "opacity-0 scale-50"
            }`}
          style={{ animation: "float 7s ease-in-out infinite", animationDelay: "1s" }}
        />
        <div
          className={`absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full blur-2xl transition-all duration-1000 delay-300 ${phase !== "init" ? "opacity-50 scale-100" : "opacity-0 scale-50"
            }`}
          style={{ animation: "float 5s ease-in-out infinite", animationDelay: "0.5s" }}
        />

        {/* Radial lines effect */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] transition-all duration-1000 ${phase !== "init" ? "opacity-10 scale-100" : "opacity-0 scale-0"
            }`}
        >
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-[1px] h-[300px] bg-gradient-to-b from-primary/50 to-transparent origin-top"
              style={{ transform: `rotate(${i * 30}deg)` }}
            />
          ))}
        </div>
      </div>

      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Target
          className={`absolute top-[20%] left-[15%] w-6 h-6 text-primary/30 transition-all duration-700 ${phase === "tagline" || phase === "exit" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          style={{ animation: "float 4s ease-in-out infinite" }}
        />
        <TrendingUp
          className={`absolute top-[25%] right-[20%] w-5 h-5 text-accent/30 transition-all duration-700 delay-100 ${phase === "tagline" || phase === "exit" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          style={{ animation: "float 5s ease-in-out infinite", animationDelay: "0.5s" }}
        />
        <Sparkles
          className={`absolute bottom-[30%] left-[20%] w-5 h-5 text-purple-500/30 transition-all duration-700 delay-200 ${phase === "tagline" || phase === "exit" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          style={{ animation: "float 6s ease-in-out infinite", animationDelay: "1s" }}
        />
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div
          className={`relative transition-all duration-700 ease-out ${phase === "init"
            ? "scale-50 opacity-0"
            : phase === "logo"
              ? "scale-100 opacity-100"
              : phase === "text" || phase === "tagline"
                ? "scale-90 opacity-100 -translate-y-2"
                : "scale-75 opacity-0 -translate-y-8"
            }`}
        >
          <div className="relative">
            {/* Outer glow */}
            <div
              className={`absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-primary via-accent to-primary blur-2xl transition-all duration-1000 ${phase !== "init" ? "opacity-50 scale-110" : "opacity-0 scale-100"
                }`}
              style={{ animation: phase !== "init" ? "pulse 3s ease-in-out infinite" : "none" }}
            />

            {/* Inner glow ring */}
            <div
              className={`absolute -inset-1 rounded-[1.5rem] bg-gradient-to-r from-primary to-accent transition-all duration-700 ${phase !== "init" ? "opacity-80" : "opacity-0"
                }`}
            />

            {/* Logo container */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-[1.25rem] bg-gradient-to-br from-primary via-primary/90 to-accent flex items-center justify-center shadow-2xl shadow-primary/30">
              {/* Inner shine effect */}
              <div className="absolute inset-0 rounded-[1.25rem] bg-gradient-to-br from-white/20 via-transparent to-transparent" />

              <Zap
                className={`w-14 h-14 sm:w-16 sm:h-16 text-primary-foreground drop-shadow-lg transition-all duration-500 ${phase !== "init" ? "scale-100 rotate-0" : "scale-50 rotate-[-20deg]"
                  }`}
                strokeWidth={2.5}
              />
            </div>

            {/* Animated rings */}
            <div
              className={`absolute inset-0 rounded-[1.5rem] border-2 border-primary/40 transition-all duration-500 ${phase !== "init" ? "opacity-100" : "opacity-0"
                }`}
              style={{ animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite" }}
            />
            <div
              className={`absolute inset-0 rounded-[1.5rem] border border-primary/20 transition-all duration-500 ${phase !== "init" ? "opacity-100" : "opacity-0"
                }`}
              style={{ animation: "ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite", animationDelay: "0.5s" }}
            />
          </div>
        </div>

        {/* Brand name with staggered letter animation */}
        <div
          className={`mt-8 transition-all duration-700 ease-out ${phase === "text" || phase === "tagline" || phase === "exit"
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
            } ${phase === "exit" ? "opacity-0" : ""}`}
        >
          <h1 className="text-5xl sm:text-6xl font-bold font-display tracking-tight">
            <span className="text-gradient-animate inline-block">Pathfy</span>
          </h1>
        </div>

        {/* Tagline with typewriter effect */}
        <div
          className={`mt-4 transition-all duration-700 ease-out ${phase === "tagline" || phase === "exit"
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
            } ${phase === "exit" ? "opacity-0" : ""}`}
        >
          <p className="text-center text-base sm:text-lg text-muted-foreground font-medium tracking-wide">
            Your Path to Success, <span className="text-primary font-semibold">Simplified.</span>
          </p>
        </div>

        {/* Feature badges */}
        <div
          className={`flex items-center gap-3 mt-6 transition-all duration-700 delay-200 ${phase === "tagline" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            } ${phase === "exit" ? "opacity-0" : ""}`}
        >
          {["AI-Powered", "Goal Tracking", "Smart Insights"].map((text, i) => (
            <span
              key={text}
              className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary/80 border border-primary/20"
              style={{
                transitionDelay: `${i * 100 + 400}ms`,
                opacity: phase === "tagline" ? 1 : 0,
                transform: phase === "tagline" ? "translateY(0)" : "translateY(8px)"
              }}
            >
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Advanced loading indicator */}
      <div
        className={`absolute bottom-16 sm:bottom-20 transition-all duration-500 ${phase === "tagline" ? "opacity-100" : "opacity-0"
          }`}
      >
        <div className="flex items-center gap-3">
          <div className="relative w-32 h-1 bg-border rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full"
              style={{
                animation: "loading 1.5s ease-in-out infinite",
                width: "40%"
              }}
            />
          </div>
        </div>
      </div>

      {/* Custom keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(150%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}