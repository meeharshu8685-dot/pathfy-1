import { Clock, AlertTriangle, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CommitmentWarningProps {
  totalHours: number;
  weeklyHours: number;
  totalWeeks: number;
  dailyMinutes: number;
}

export function CommitmentWarning({ totalHours, weeklyHours, totalWeeks, dailyMinutes }: CommitmentWarningProps) {
  const getDailyCommitmentLevel = () => {
    if (dailyMinutes < 60) return { level: "Light", color: "text-success" };
    if (dailyMinutes < 120) return { level: "Moderate", color: "text-warning" };
    return { level: "Intensive", color: "text-destructive" };
  };

  const commitment = getDailyCommitmentLevel();

  return (
    <Card className="border-warning/30 bg-warning/5">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-warning mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-base mb-2">Commitment & Time Reality</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This goal requires approximately <strong>{totalHours} hours</strong> of focused work. 
              At your pace of <strong>{weeklyHours} hours per week</strong>, expect to invest 
              around <strong>{totalWeeks} weeks</strong> of consistent effort.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-lg bg-background/50 text-center">
            <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className={`text-lg font-bold ${commitment.color}`}>{Math.round(dailyMinutes)} min</p>
            <p className="text-xs text-muted-foreground">Daily average</p>
          </div>
          <div className="p-3 rounded-lg bg-background/50 text-center">
            <Calendar className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-bold">{weeklyHours}h</p>
            <p className="text-xs text-muted-foreground">Per week</p>
          </div>
          <div className="p-3 rounded-lg bg-background/50 text-center">
            <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${commitment.color} bg-current/10 inline-block mb-1`}>
              {commitment.level}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Intensity</p>
          </div>
        </div>

        <div className="pt-2 border-t border-warning/20">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Trade-offs to consider:</strong> This commitment may require 
            reducing social activities, limiting entertainment time, or adjusting sleep schedules. 
            Be honest with yourself about what you can sustain long-term.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
