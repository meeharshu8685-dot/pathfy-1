import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { useGoals } from "@/hooks/useGoals";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Target, Loader2 } from "lucide-react";

export function GoalManagement() {
  const { goals, updateGoal } = useGoals();
  const navigate = useNavigate();
  const [isResetting, setIsResetting] = useState(false);

  const activeGoal = goals.find((g) => g.is_active);

  const handleChangeGoal = async () => {
    setIsResetting(true);
    try {
      // Deactivate all active goals
      for (const goal of goals.filter((g) => g.is_active)) {
        await updateGoal.mutateAsync({ id: goal.id, is_active: false });
      }
      
      toast({
        title: "Goal reset",
        description: "You can now set a new goal.",
      });
      
      navigate("/reality-check");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset goal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="p-6 rounded-xl card-gradient border border-border">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-primary" />
        Goal Management
      </h3>

      {activeGoal ? (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Current Goal</p>
            <p className="font-medium">{activeGoal.title}</p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Change Goal
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Change your goal?</AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>This will reset your goal-specific data including:</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Current goal progress</li>
                    <li>Roadmap and tasks</li>
                  </ul>
                  <p className="font-medium text-foreground mt-4">
                    Your account, tokens, and streak history will remain intact.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Current Goal</AlertDialogCancel>
                <AlertDialogAction onClick={handleChangeGoal} disabled={isResetting}>
                  {isResetting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Yes, Change Goal
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-muted-foreground mb-4">No active goal set</p>
          <Button onClick={() => navigate("/reality-check")} variant="hero">
            <Target className="w-4 h-4 mr-2" />
            Set a New Goal
          </Button>
        </div>
      )}
    </div>
  );
}