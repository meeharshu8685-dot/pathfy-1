import * as React from "react";
import { cn } from "@/lib/utils";

type Status = "realistic" | "warning" | "risky" | "unrealistic" | "locked" | "unlocked" | "completed";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  realistic: {
    label: "✅ Realistic",
    className: "bg-success/20 text-success border-success/30",
  },
  warning: {
    label: "⚠️ Warning",
    className: "bg-warning/20 text-warning border-warning/30",
  },
  risky: {
    label: "⚠️ Risky",
    className: "bg-warning/20 text-warning border-warning/30",
  },
  unrealistic: {
    label: "❌ Unrealistic",
    className: "bg-destructive/20 text-destructive border-destructive/30",
  },
  locked: {
    label: "🔒 Locked",
    className: "bg-muted text-muted-foreground border-muted",
  },
  unlocked: {
    label: "🔓 Unlocked",
    className: "bg-primary/20 text-primary border-primary/30",
  },
  completed: {
    label: "✓ Completed",
    className: "bg-success/20 text-success border-success/30",
  },
};

export const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  function StatusBadge({ status, className }, ref) {
    const config = statusConfig[status];

    if (!config) {
      return null;
    }

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-colors",
          config.className,
          className
        )}
      >
        {config.label}
      </span>
    );
  }
);
