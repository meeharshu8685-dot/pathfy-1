import { Sparkles } from "lucide-react";

interface MotivationSectionProps {
  goal: string;
  message?: string;
}

export function MotivationSection({ goal, message }: MotivationSectionProps) {
  const defaultMessage = `Every expert was once a beginner. By breaking "${goal}" into clear, actionable steps, you have already done what most people never do—you have created a real plan. Now, it is about showing up consistently, one task at a time.`;

  return (
    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
      <div className="flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground leading-relaxed italic">
          {message || defaultMessage}
        </p>
      </div>
    </div>
  );
}
