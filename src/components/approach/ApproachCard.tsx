import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Zap, Activity, User, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";
import { ApproachEvaluation } from "@/lib/approachEvaluator";

interface ApproachCardProps {
    evaluation: ApproachEvaluation;
    isSelected: boolean;
    onSelect: () => void;
}

const fitStatusConfig = {
    good_fit: {
        label: "Good Fit",
        icon: CheckCircle,
        className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        bgClass: "border-emerald-500/30 hover:border-emerald-500/50"
    },
    needs_adjustment: {
        label: "Needs Adjustment",
        icon: AlertTriangle,
        className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        bgClass: "border-amber-500/30 hover:border-amber-500/50"
    },
    high_pressure: {
        label: "High Pressure",
        icon: AlertCircle,
        className: "bg-orange-500/10 text-orange-600 border-orange-500/20",
        bgClass: "border-orange-500/30 hover:border-orange-500/50"
    }
};

const intensityConfig = {
    low: { label: "Low Intensity", className: "bg-blue-500/10 text-blue-600" },
    moderate: { label: "Moderate Intensity", className: "bg-purple-500/10 text-purple-600" },
    high: { label: "High Intensity", className: "bg-rose-500/10 text-rose-600" }
};

export function ApproachCard({ evaluation, isSelected, onSelect }: ApproachCardProps) {
    const { approach, fitStatus, riskLevel, reasoning } = evaluation;
    const statusConfig = fitStatusConfig[fitStatus];
    const StatusIcon = statusConfig.icon;
    const intensity = intensityConfig[approach.intensityLevel];

    return (
        <Card
            className={`relative transition-all duration-200 cursor-pointer ${isSelected
                    ? 'ring-2 ring-primary border-primary bg-primary/5'
                    : statusConfig.bgClass
                }`}
            onClick={onSelect}
        >
            {isSelected && (
                <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-primary-foreground">Selected</Badge>
                </div>
            )}

            <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${statusConfig.className}`}>
                        <StatusIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-lg font-semibold">{approach.name}</CardTitle>
                        <Badge variant="outline" className={`mt-1 ${intensity.className}`}>
                            {intensity.label}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{approach.description}</p>

                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{approach.durationRange}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-muted-foreground" />
                        <span>{approach.dailyEffortRange}/day</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-muted-foreground" />
                        <span className="capitalize">{approach.lifestyleTradeOff.replace('_', ' ')} trade-off</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="capitalize">{riskLevel} risk</span>
                    </div>
                </div>

                <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Who this suits:</p>
                    <p className="text-sm">{approach.whoThisSuits}</p>
                </div>

                {reasoning && (
                    <div className={`p-3 rounded-lg text-sm ${statusConfig.className}`}>
                        <p className="font-medium mb-1 flex items-center gap-1">
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                        </p>
                        <p className="text-xs opacity-80">{reasoning}</p>
                    </div>
                )}

                <Button
                    variant={isSelected ? "default" : "outline"}
                    className="w-full mt-2"
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect();
                    }}
                >
                    {isSelected ? "Selected" : "Choose This Approach"}
                </Button>
            </CardContent>
        </Card>
    );
}
