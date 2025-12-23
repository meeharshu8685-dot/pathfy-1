import { EyeOff, AlertTriangle, Heart } from "lucide-react";

interface RoadmapRealityLayerProps {
  whatToIgnore: string[];
  finalRealityCheck: string;
  closingMotivation: string;
}

export function RoadmapRealityLayer({
  whatToIgnore,
  finalRealityCheck,
  closingMotivation,
}: RoadmapRealityLayerProps) {
  return (
    <div className="space-y-6">
      {/* What to Ignore */}
      <div className="p-6 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center">
            <EyeOff className="w-5 h-5 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold">What to IGNORE for now</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          To protect your focus and avoid burnout, consciously ignore these:
        </p>
        <ul className="space-y-2">
          {whatToIgnore.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="text-destructive font-bold">×</span>
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Final Reality Check */}
      <div className="p-6 rounded-xl bg-amber-500/5 border border-amber-500/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="text-lg font-semibold text-amber-500">Final Reality Check</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {finalRealityCheck}
        </p>
      </div>

      {/* Closing Motivation */}
      <div className="p-6 rounded-xl bg-primary/5 border border-primary/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-primary">A Note from Your Mentor</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed italic">
          "{closingMotivation}"
        </p>
      </div>
    </div>
  );
}
