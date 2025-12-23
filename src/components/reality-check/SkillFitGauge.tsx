import { useEffect, useState } from "react";

interface SkillFitGaugeProps {
  currentFit: number;
  expectedFit: number;
  label?: string;
}

export function SkillFitGauge({ currentFit, expectedFit, label }: SkillFitGaugeProps) {
  const [animatedCurrent, setAnimatedCurrent] = useState(0);
  const [animatedExpected, setAnimatedExpected] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedCurrent(currentFit);
      setAnimatedExpected(expectedFit);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentFit, expectedFit]);

  const circumference = 2 * Math.PI * 45;
  const currentOffset = circumference - (animatedCurrent / 100) * circumference;
  const expectedOffset = circumference - (animatedExpected / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      {label && <p className="text-sm font-medium text-muted-foreground">{label}</p>}
      
      <div className="relative w-32 h-32">
        {/* Background circle */}
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          {/* Expected fit (larger, background) */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--primary) / 0.3)"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={expectedOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          {/* Current fit (foreground) */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={currentOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{animatedCurrent}%</span>
          <span className="text-xs text-muted-foreground">Current</span>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">Current: {currentFit}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary/30" />
          <span className="text-muted-foreground">Expected: {expectedFit}%</span>
        </div>
      </div>
    </div>
  );
}
