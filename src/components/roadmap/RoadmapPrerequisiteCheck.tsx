import { useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RoadmapPrerequisiteCheckProps {
  hasCompletedRealityCheck: boolean;
  hasCompletedDecomposer: boolean;
  goalTitle?: string;
}

export function RoadmapPrerequisiteCheck({
  hasCompletedRealityCheck,
  hasCompletedDecomposer,
  goalTitle,
}: RoadmapPrerequisiteCheckProps) {
  const navigate = useNavigate();

  const allComplete = hasCompletedRealityCheck && hasCompletedDecomposer;

  if (allComplete) {
    return null;
  }

  return (
    <div className="p-6 rounded-xl bg-amber-500/5 border border-amber-500/30 mb-8">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-amber-500 mb-2">
            Complete These Steps First
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            The Roadmap Generator creates a personalized learning path based on your Reality Check and Goal Decomposition results.
            {goalTitle && ` We'll build a roadmap for: "${goalTitle}"`}
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {hasCompletedRealityCheck ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
              )}
              <span className={hasCompletedRealityCheck ? "text-success" : "text-foreground"}>
                Reality Check
              </span>
              {!hasCompletedRealityCheck && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto gap-1"
                  onClick={() => navigate("/reality-check")}
                >
                  Start <ArrowRight className="w-3 h-3" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {hasCompletedDecomposer ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
              )}
              <span className={hasCompletedDecomposer ? "text-success" : "text-foreground"}>
                Problem Decomposer
              </span>
              {!hasCompletedDecomposer && hasCompletedRealityCheck && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto gap-1"
                  onClick={() => navigate("/problem-decomposer")}
                >
                  Start <ArrowRight className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
