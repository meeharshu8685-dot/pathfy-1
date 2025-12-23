import { Calendar, Clock, Shield } from "lucide-react";

interface TimelineRangeProps {
  minimum: string;
  average: string;
  safe: string;
}

export function TimelineRange({ minimum, average, safe }: TimelineRangeProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-muted-foreground">Time to Goal</h4>
      
      <div className="relative">
        {/* Timeline bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-destructive via-warning to-success rounded-full" />
        </div>
        
        {/* Markers */}
        <div className="flex justify-between mt-1">
          <div className="flex flex-col items-start">
            <div className="w-0.5 h-2 bg-destructive -mt-3" />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-2 bg-warning -mt-3" />
          </div>
          <div className="flex flex-col items-end">
            <div className="w-0.5 h-2 bg-success -mt-3" />
          </div>
        </div>
      </div>

      {/* Time cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <div className="flex items-center gap-2 text-destructive mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium">Minimum</span>
          </div>
          <p className="text-lg font-semibold">{minimum}</p>
          <p className="text-xs text-muted-foreground">Aggressive path</p>
        </div>

        <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
          <div className="flex items-center gap-2 text-warning mb-1">
            <Calendar className="h-4 w-4" />
            <span className="text-xs font-medium">Average</span>
          </div>
          <p className="text-lg font-semibold">{average}</p>
          <p className="text-xs text-muted-foreground">Realistic path</p>
        </div>

        <div className="p-3 rounded-lg bg-success/10 border border-success/20">
          <div className="flex items-center gap-2 text-success mb-1">
            <Shield className="h-4 w-4" />
            <span className="text-xs font-medium">Safe</span>
          </div>
          <p className="text-lg font-semibold">{safe}</p>
          <p className="text-xs text-muted-foreground">Conservative</p>
        </div>
      </div>
    </div>
  );
}
