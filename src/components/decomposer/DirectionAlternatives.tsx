import { ArrowRight, TrendingUp, TrendingDown, Target, DollarSign, BarChart3, Gauge } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface CareerPosition {
  title: string;
  description: string;
  salaryRange: string;
  marketDemand: "low" | "medium" | "high" | "very-high";
  difficulty: "easy" | "moderate" | "challenging" | "hard";
}

interface DirectionAlternativesProps {
  currentGoal: string;
  lowerPosition: CareerPosition;
  targetPosition: CareerPosition;
  higherPosition: CareerPosition;
  onSelectGoal: (position: CareerPosition) => void;
}

const demandConfig = {
  low: { label: "Low Demand", color: "text-muted-foreground", bg: "bg-muted" },
  medium: { label: "Medium Demand", color: "text-warning", bg: "bg-warning/10" },
  high: { label: "High Demand", color: "text-success", bg: "bg-success/10" },
  "very-high": { label: "Very High", color: "text-primary", bg: "bg-primary/10" },
};

const difficultyConfig = {
  easy: { label: "Easier Path", color: "text-success" },
  moderate: { label: "Moderate", color: "text-warning" },
  challenging: { label: "Challenging", color: "text-orange-500" },
  hard: { label: "Hard", color: "text-destructive" },
};

function PositionCard({ 
  position, 
  type, 
  onSelect,
  isTarget = false 
}: { 
  position: CareerPosition; 
  type: "lower" | "target" | "higher";
  onSelect: () => void;
  isTarget?: boolean;
}) {
  const demand = demandConfig[position.marketDemand];
  const difficulty = difficultyConfig[position.difficulty];

  const typeConfig = {
    lower: { icon: TrendingDown, label: "Lower Adjacent", border: "border-success/30", bg: "bg-success/5" },
    target: { icon: Target, label: "Your Target", border: "border-primary", bg: "bg-primary/5" },
    higher: { icon: TrendingUp, label: "Growth Position", border: "border-blue-500/30", bg: "bg-blue-500/5" },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Card className={`${config.border} ${config.bg} transition-all hover:shadow-md ${isTarget ? "ring-2 ring-primary" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`h-4 w-4 ${type === "target" ? "text-primary" : type === "lower" ? "text-success" : "text-blue-500"}`} />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {config.label}
            </span>
          </div>
          {isTarget && <Badge variant="default" className="text-xs">Current Goal</Badge>}
        </div>
        <CardTitle className="text-lg mt-2">{position.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{position.description}</p>
        
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="p-2 rounded-md bg-background/50">
            <div className="flex items-center gap-1 text-muted-foreground mb-1">
              <DollarSign className="h-3 w-3" />
              <span>Salary</span>
            </div>
            <p className="font-semibold">{position.salaryRange}</p>
          </div>
          
          <div className="p-2 rounded-md bg-background/50">
            <div className="flex items-center gap-1 text-muted-foreground mb-1">
              <BarChart3 className="h-3 w-3" />
              <span>Demand</span>
            </div>
            <p className={`font-semibold ${demand.color}`}>{demand.label}</p>
          </div>
          
          <div className="p-2 rounded-md bg-background/50">
            <div className="flex items-center gap-1 text-muted-foreground mb-1">
              <Gauge className="h-3 w-3" />
              <span>Difficulty</span>
            </div>
            <p className={`font-semibold ${difficulty.color}`}>{difficulty.label}</p>
          </div>
        </div>

        {!isTarget && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full gap-2"
            onClick={onSelect}
          >
            Set as New Goal
            <ArrowRight className="h-3 w-3" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function DirectionAlternatives({ 
  currentGoal, 
  lowerPosition, 
  targetPosition, 
  higherPosition,
  onSelectGoal 
}: DirectionAlternativesProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Target className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Direction & Alternatives</h3>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Based on your goal, here are related positions at different levels. 
        Click any position to explore it as a new goal.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PositionCard 
          position={lowerPosition} 
          type="lower" 
          onSelect={() => onSelectGoal(lowerPosition)}
        />
        <PositionCard 
          position={targetPosition} 
          type="target" 
          onSelect={() => {}}
          isTarget
        />
        <PositionCard 
          position={higherPosition} 
          type="higher" 
          onSelect={() => onSelectGoal(higherPosition)}
        />
      </div>
    </div>
  );
}
