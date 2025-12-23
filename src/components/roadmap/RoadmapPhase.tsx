import { Target, Clock, BookOpen, Hammer, CheckCircle2 } from "lucide-react";

interface RoadmapPhaseProps {
  phaseNumber: number;
  phaseName: string;
  goal: string;
  timeEstimate: string;
  whatToLearn: string[];
  whatToDo: string[];
  outcome: string;
}

export function RoadmapPhase({
  phaseNumber,
  phaseName,
  goal,
  timeEstimate,
  whatToLearn,
  whatToDo,
  outcome,
}: RoadmapPhaseProps) {
  return (
    <div className="p-6 rounded-xl bg-card border border-border">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold">
          {phaseNumber}
        </div>
        <h3 className="text-lg font-semibold">
          Phase {phaseNumber} — {phaseName}
        </h3>
      </div>

      <div className="space-y-4">
        {/* Goal */}
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-sm font-medium text-primary">Goal</span>
            <p className="text-sm text-muted-foreground">{goal}</p>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-sm font-medium text-amber-500">Time</span>
            <p className="text-sm text-muted-foreground">{timeEstimate}</p>
          </div>
        </div>

        {/* What to Learn */}
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-sm font-medium text-blue-500">What to learn</span>
            <ul className="mt-1 space-y-1">
              {whatToLearn.map((item, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-muted-foreground/50">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* What to Do */}
        <div className="flex items-start gap-3">
          <Hammer className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-sm font-medium text-orange-500">What to DO (important)</span>
            <ul className="mt-1 space-y-1">
              {whatToDo.map((item, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-muted-foreground/50">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Outcome */}
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-sm font-medium text-success">Outcome</span>
            <p className="text-sm text-muted-foreground">{outcome}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
