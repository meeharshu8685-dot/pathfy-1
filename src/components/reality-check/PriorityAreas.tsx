import { Target, ChevronRight } from "lucide-react";

interface PriorityAreasProps {
  areas: string[];
}

export function PriorityAreas({ areas }: PriorityAreasProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Target className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-medium">Top Priority Focus Areas</h4>
      </div>
      
      <div className="space-y-2">
        {areas.map((area, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
              {index + 1}
            </div>
            <span className="flex-1 text-sm">{area}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}
