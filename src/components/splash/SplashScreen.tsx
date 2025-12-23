import { useState, useEffect } from "react";
import { Zap } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export function SplashScreen({ onComplete, duration = 2500 }: SplashScreenProps) {
  const [phase, setPhase] = useState<"logo" | "text" | "exit">("logo");

  useEffect(() => {
    const logoTimer = setTimeout(() => setPhase("text"), 600);
    const textTimer = setTimeout(() => setPhase("exit"), duration - 500);
    const exitTimer = setTimeout(onComplete, duration);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(textTimer);
      clearTimeout(exitTimer);
    };
  }, [onComplete, duration]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-all duration-500 ${
        phase === "exit" ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
          <div 
            className={`absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-full blur-3xl transition-all duration-1000 ${
              phase !== "logo" ? "scale-150 opacity-30" : "scale-100 opacity-50"
            }`}
          />
        </div>
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-primary/5 rounded-full blur-xl animate-float" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Logo */}
      <div 
        className={`relative z-10 transition-all duration-700 ease-out ${
          phase === "logo" 
            ? "scale-100 opacity-100" 
            : phase === "text" 
              ? "scale-90 opacity-100 -translate-y-4" 
              : "scale-75 opacity-0 -translate-y-8"
        }`}
      >
        <div className="relative">
          {/* Glow ring */}
          <div 
            className={`absolute inset-0 rounded-3xl bg-gradient-to-r from-primary via-accent to-primary blur-xl transition-all duration-1000 ${
              phase !== "logo" ? "opacity-60 scale-125" : "opacity-40 scale-100"
            }`}
          />
          
          {/* Logo container */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-2xl">
            <Zap 
              className={`w-12 h-12 sm:w-14 sm:h-14 text-primary-foreground transition-all duration-500 ${
                phase !== "logo" ? "scale-110" : "scale-100"
              }`} 
            />
          </div>

          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-3xl border-2 border-primary/30 animate-ping" style={{ animationDuration: "2s" }} />
          <div className="absolute inset-0 rounded-3xl border border-primary/20 animate-ping" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }} />
        </div>
      </div>

      {/* Brand name */}
      <div 
        className={`relative z-10 mt-8 transition-all duration-700 ease-out ${
          phase === "text" || phase === "exit"
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-8"
        } ${phase === "exit" ? "opacity-0" : ""}`}
      >
        <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight">
          <span className="text-gradient-animate">Pathly</span>
        </h1>
        <p 
          className={`text-center text-sm sm:text-base text-muted-foreground mt-3 transition-all duration-500 delay-200 ${
            phase === "text" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Execution Intelligence Engine
        </p>
      </div>

      {/* Loading indicator */}
      <div 
        className={`absolute bottom-12 sm:bottom-16 transition-all duration-500 ${
          phase === "text" ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}