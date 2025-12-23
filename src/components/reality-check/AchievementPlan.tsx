import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Target,
  TrendingUp,
  Download,
  Heart,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { SkillFitGauge } from "./SkillFitGauge";
import { TimelineRange } from "./TimelineRange";
import { PriorityAreas } from "./PriorityAreas";
import { AlternativePositions } from "./AlternativePositions";
import { ResourcesList } from "./ResourcesList";

export interface AchievementPlanData {
  feasibilityStatus: "realistic" | "risky" | "unrealistic";
  requiredHours: number;
  effectiveAvailableHours: number;
  explanation: string;
  howToAchieve: {
    minimumWeeklyCommitment: number;
    recommendedWeeklyCommitment: number;
    topPriorityAreas: string[];
    timeToGoal: {
      minimum: string;
      average: string;
      safe: string;
    };
    skillFitProjection: {
      currentFit: number;
      expectedFit: number;
    };
    alternativePositions: {
      lowerAdjacent: { title: string; description: string };
      higherGrowth: { title: string; description: string };
    };
    recommendedResources: { title: string; type: string; reason: string }[];
    healthyAdvice: string;
    motivationalLine: string;
  };
}

interface AchievementPlanProps {
  data: AchievementPlanData;
  onDecompose: () => void;
  onTryAnother: () => void;
  onDownload: () => void;
  isDownloading?: boolean;
}

const statusConfig = {
  realistic: {
    icon: CheckCircle,
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
    badge: "bg-success text-success-foreground",
    label: "Realistic Goal",
  },
  risky: {
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
    badge: "bg-warning text-warning-foreground",
    label: "Risky Goal",
  },
  unrealistic: {
    icon: XCircle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-800",
    label: "Needs Adjustment",
  },
};

export function AchievementPlan({ 
  data, 
  onDecompose, 
  onTryAnother, 
  onDownload,
  isDownloading 
}: AchievementPlanProps) {
  const status = statusConfig[data.feasibilityStatus];
  const StatusIcon = status.icon;
  const hourGap = data.requiredHours - data.effectiveAvailableHours;

  return (
    <div className="space-y-6">
      {/* Feasibility Status Card */}
      <Card className={`${status.border} ${status.bg}`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${status.bg}`}>
              <StatusIcon className={`h-8 w-8 ${status.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={status.badge}>{status.label}</Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {data.explanation}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Effort Comparison */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Effort Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Required Hours</p>
              <p className="text-2xl font-bold">{data.requiredHours.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Effective Available</p>
              <p className="text-2xl font-bold">{data.effectiveAvailableHours.toLocaleString()}</p>
            </div>
          </div>
          
          {/* Visual comparison bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 hours</span>
              <span>{Math.max(data.requiredHours, data.effectiveAvailableHours).toLocaleString()} hours</span>
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-primary/30 absolute"
                style={{ width: `${Math.min(100, (data.requiredHours / Math.max(data.requiredHours, data.effectiveAvailableHours)) * 100)}%` }}
              />
              <div 
                className="h-full bg-primary absolute"
                style={{ width: `${Math.min(100, (data.effectiveAvailableHours / Math.max(data.requiredHours, data.effectiveAvailableHours)) * 100)}%` }}
              />
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-primary" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-primary/30" />
                <span>Required</span>
              </div>
            </div>
          </div>

          {hourGap > 0 && (
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
              <p className="text-sm text-warning font-medium">
                Gap: {hourGap.toLocaleString()} hours short
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Commitment */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-4 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-2">Minimum Weekly</p>
              <p className="text-3xl font-bold text-primary">{data.howToAchieve.minimumWeeklyCommitment}</p>
              <p className="text-xs text-muted-foreground">hours/week</p>
            </div>
            <div className="text-center p-4 rounded-lg border-2 border-primary bg-primary/5">
              <p className="text-xs text-muted-foreground mb-2">Recommended</p>
              <p className="text-3xl font-bold text-primary">{data.howToAchieve.recommendedWeeklyCommitment}</p>
              <p className="text-xs text-muted-foreground">hours/week</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Range */}
      <Card>
        <CardContent className="p-6">
          <TimelineRange 
            minimum={data.howToAchieve.timeToGoal.minimum}
            average={data.howToAchieve.timeToGoal.average}
            safe={data.howToAchieve.timeToGoal.safe}
          />
        </CardContent>
      </Card>

      {/* Skill Fit Projection */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Skill Fit Projection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SkillFitGauge 
            currentFit={data.howToAchieve.skillFitProjection.currentFit}
            expectedFit={data.howToAchieve.skillFitProjection.expectedFit}
          />
        </CardContent>
      </Card>

      {/* Priority Areas */}
      <Card>
        <CardContent className="p-6">
          <PriorityAreas areas={data.howToAchieve.topPriorityAreas} />
        </CardContent>
      </Card>

      {/* Alternative Positions */}
      <Card>
        <CardContent className="p-6">
          <AlternativePositions 
            lowerAdjacent={data.howToAchieve.alternativePositions.lowerAdjacent}
            higherGrowth={data.howToAchieve.alternativePositions.higherGrowth}
          />
        </CardContent>
      </Card>

      {/* Recommended Resources */}
      <Card>
        <CardContent className="p-6">
          <ResourcesList resources={data.howToAchieve.recommendedResources} />
        </CardContent>
      </Card>

      {/* Healthy Advice */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Heart className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-medium mb-2">Healthy Perspective</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {data.howToAchieve.healthyAdvice}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Line */}
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2 text-primary">
          <Sparkles className="h-4 w-4" />
          <p className="text-sm font-medium italic">
            "{data.howToAchieve.motivationalLine}"
          </p>
          <Sparkles className="h-4 w-4" />
        </div>
      </div>

      <Separator />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" onClick={onDownload} disabled={isDownloading} className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          {isDownloading ? "Generating..." : "Download Blueprint"}
        </Button>
        
        {data.feasibilityStatus !== "unrealistic" ? (
          <Button onClick={onDecompose} className="flex-1">
            Continue to Decompose
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button variant="secondary" onClick={onTryAnother} className="flex-1">
            <Target className="h-4 w-4 mr-2" />
            Try Different Goal
          </Button>
        )}
      </div>
    </div>
  );
}
