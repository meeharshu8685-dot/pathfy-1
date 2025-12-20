import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface TokenDisplayProps {
  tokens: number;
  maxTokens?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function TokenDisplay({ tokens, maxTokens, size = "md", className }: TokenDisplayProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border",
        sizeClasses[size],
        className
      )}
    >
      <Zap className={cn(iconSizes[size], "text-primary")} />
      <span className="font-mono font-semibold text-foreground">
        {tokens}
        {maxTokens && <span className="text-muted-foreground">/{maxTokens}</span>}
      </span>
      <span className="text-muted-foreground text-sm">tokens</span>
    </div>
  );
}
