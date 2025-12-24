import { format } from "date-fns";
import { History, Target, Clock, TrendingUp, ChevronRight, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGoals } from "@/hooks/useGoals";
import { useNavigate } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

type Goal = Tables<"goals">;

const statusConfig = {
  realistic: {
    label: "Realistic",
    icon: CheckCircle,
    className: "bg-success/10 text-success border-success/20",
  },
  risky: {
    label: "Risky",
    icon: AlertTriangle,
    className: "bg-warning/10 text-warning border-warning/20",
  },
  unrealistic: {
    label: "Unrealistic",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

const fieldLabels: Record<string, string> = {
  tech: "Technology",
  medical: "Medical",
  exams: "Exams",
  business: "Business",
  sports: "Sports",
  arts: "Arts",
  govt: "Government",
  other: "Other",
};

interface GoalHistoryProps {
  onSelectGoal?: (goal: Goal) => void;
}

export function GoalHistory({ onSelectGoal }: GoalHistoryProps) {
  const { goals, isLoading } = useGoals();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card variant="glass" className="animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-primary" />
            Analysis History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!goals || goals.length === 0) {
    return (
      <Card variant="glass" className="animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-primary" />
            Analysis History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No previous analyses yet.</p>
            <p className="text-xs mt-1">Complete your first goal analysis to see it here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleViewDetails = (goal: Goal) => {
    if (onSelectGoal) {
      onSelectGoal(goal);
    } else {
      // Navigate to reality check to view the saved analysis
      navigate(`/reality-check?goalId=${goal.id}`);
    }
  };

  return (
    <Card variant="glass" className="animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-display">
            <History className="h-5 w-5 text-primary" />
            Analysis History
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {goals.length} {goals.length === 1 ? "goal" : "goals"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {goals.slice(0, 5).map((goal, index) => {
          const status = goal.feasibility_status ? statusConfig[goal.feasibility_status] : null;
          const StatusIcon = status?.icon || Target;

          return (
            <button
              key={goal.id}
              onClick={() => handleViewDetails(goal)}
              className="w-full flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-200 group text-left"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${status?.className || "bg-muted text-muted-foreground"}`}>
                <StatusIcon className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm sm:text-base truncate">{goal.title}</h4>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(goal.created_at), "MMM d, yyyy")}
                  </span>
                  {goal.field && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {fieldLabels[goal.field] || goal.field}
                    </Badge>
                  )}
                  {goal.hours_per_week && (
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {goal.hours_per_week}h/week
                    </span>
                  )}
                </div>
              </div>

              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </button>
          );
        })}

        {goals.length > 5 && (
          <Button
            variant="ghost"
            className="w-full mt-2 text-sm"
            onClick={() => navigate("/dashboard")}
          >
            View all {goals.length} goals
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}