import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { Bell } from "lucide-react";

export function ReassessmentReminder() {
  const { profile, updateProfile } = useProfile();
  
  const [enabled, setEnabled] = useState(profile?.reassessment_reminder_enabled || false);
  const [days, setDays] = useState(profile?.reassessment_reminder_days || 30);

  const handleToggle = async (checked: boolean) => {
    setEnabled(checked);
    try {
      await updateProfile.mutateAsync({
        reassessment_reminder_enabled: checked,
        reassessment_reminder_days: days,
      });
      toast({
        title: checked ? "Reminder enabled" : "Reminder disabled",
        description: checked 
          ? `We'll remind you to reassess your goal in ${days} days.`
          : "You won't receive reassessment reminders.",
      });
    } catch (error) {
      setEnabled(!checked);
      toast({
        title: "Error",
        description: "Failed to update setting.",
        variant: "destructive",
      });
    }
  };

  const handleDaysChange = async (value: number) => {
    const newDays = Math.max(7, Math.min(90, value));
    setDays(newDays);
    
    if (enabled) {
      try {
        await updateProfile.mutateAsync({
          reassessment_reminder_days: newDays,
        });
      } catch (error) {
        // Silent fail for days update
      }
    }
  };

  return (
    <div className="p-6 rounded-xl card-gradient border border-border">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Bell className="w-5 h-5 text-primary" />
        Goal Reassessment
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="reminder-toggle">Enable reminders</Label>
            <p className="text-sm text-muted-foreground">
              Get a gentle reminder to check if your goal still fits
            </p>
          </div>
          <Switch
            id="reminder-toggle"
            checked={enabled}
            onCheckedChange={handleToggle}
          />
        </div>

        {enabled && (
          <div className="flex items-center gap-3 pl-1">
            <Label htmlFor="reminder-days" className="whitespace-nowrap">
              Remind me every
            </Label>
            <Input
              id="reminder-days"
              type="number"
              value={days}
              onChange={(e) => handleDaysChange(parseInt(e.target.value) || 30)}
              className="w-20"
              min={7}
              max={90}
            />
            <span className="text-sm text-muted-foreground">days</span>
          </div>
        )}
      </div>
    </div>
  );
}