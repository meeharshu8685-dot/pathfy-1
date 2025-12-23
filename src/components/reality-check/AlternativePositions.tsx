import { ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Position {
  title: string;
  description: string;
}

interface AlternativePositionsProps {
  lowerAdjacent: Position;
  higherGrowth: Position;
}

export function AlternativePositions({ lowerAdjacent, higherGrowth }: AlternativePositionsProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground">Alternative Paths</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="border-success/30 bg-success/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-success mb-2">
              <ArrowDown className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Lower Adjacent</span>
            </div>
            <h5 className="font-semibold mb-1">{lowerAdjacent.title}</h5>
            <p className="text-sm text-muted-foreground">{lowerAdjacent.description}</p>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-primary mb-2">
              <ArrowUp className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Growth Position</span>
            </div>
            <h5 className="font-semibold mb-1">{higherGrowth.title}</h5>
            <p className="text-sm text-muted-foreground">{higherGrowth.description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
