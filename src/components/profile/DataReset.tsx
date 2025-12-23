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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { RotateCcw, Loader2 } from "lucide-react";

export function DataReset() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isResetting, setIsResetting] = useState(false);

  const handleResetPlan = async () => {
    if (!user?.id) return;
    
    setIsResetting(true);
    try {
      // Delete in order: micro_tasks -> tasks -> roadmap_steps -> roadmaps -> daily_plans
      await supabase.from("micro_tasks").delete().eq("user_id", user.id);
      await supabase.from("tasks").delete().eq("user_id", user.id);
      await supabase.from("roadmap_steps").delete().eq("user_id", user.id);
      await supabase.from("roadmaps").delete().eq("user_id", user.id);
      await supabase.from("daily_plans").delete().eq("user_id", user.id);
      
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["roadmaps"] });
      queryClient.invalidateQueries({ queryKey: ["daily_plans"] });
      
      toast({
        title: "Plan reset successfully",
        description: "Your roadmap and daily tasks have been cleared. You can generate a new roadmap anytime.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="p-6 rounded-xl card-gradient border border-border">
      <h3 className="font-semibold mb-2 flex items-center gap-2">
        <RotateCcw className="w-5 h-5 text-primary" />
        Reset My Plan
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Clear your current roadmap and daily tasks to start fresh.
      </p>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Plan
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset your plan?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>This will clear:</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Your current roadmap</li>
                <li>All tasks and micro-tasks</li>
                <li>Daily plans</li>
              </ul>
              <p className="font-medium text-foreground mt-4">
                Your account, profile, goals, and tokens remain intact.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetPlan} disabled={isResetting}>
              {isResetting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RotateCcw className="w-4 h-4 mr-2" />
              )}
              Yes, Reset Plan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}