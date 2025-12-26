import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target } from "lucide-react";

interface Goal {
    id: string;
    title: string;
    deadline: string;
    feasibility_status?: string | null;
    achievement_plan?: unknown;
    selected_approach_id?: string | null;
}

interface GoalSelectorProps {
    goals: Goal[];
    selectedGoalId: string | null;
    onSelectGoal: (goalId: string) => void;
    filterCompleted?: boolean; // Only show goals with completed reality check
}

export function GoalSelector({
    goals,
    selectedGoalId,
    onSelectGoal,
    filterCompleted = true,
}: GoalSelectorProps) {
    // Filter goals based on completion status
    const filteredGoals = filterCompleted
        ? goals.filter(g => g.feasibility_status && g.achievement_plan)
        : goals;

    if (filteredGoals.length === 0) {
        return null;
    }

    if (filteredGoals.length === 1) {
        // Don't show selector if only one goal
        return null;
    }

    return (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 border border-border">
            <Target className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                    Select Goal
                </label>
                <Select
                    value={selectedGoalId || undefined}
                    onValueChange={onSelectGoal}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a goal..." />
                    </SelectTrigger>
                    <SelectContent>
                        {filteredGoals.map((goal) => (
                            <SelectItem key={goal.id} value={goal.id}>
                                <div className="flex flex-col items-start">
                                    <span className="font-medium">{goal.title}</span>
                                    <span className="text-xs text-muted-foreground">
                                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
                                    </span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
