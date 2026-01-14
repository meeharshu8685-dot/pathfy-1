import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { Loader2, Save, X } from "lucide-react";

interface ProfileEditFormProps {
  onCancel: () => void;
  onSave: () => void;
}

export function ProfileEditForm({ onCancel, onSave }: ProfileEditFormProps) {
  const { profile, updateProfile } = useProfile();

  const [displayName, setDisplayName] = useState(profile?.display_name || profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [educationLevel, setEducationLevel] = useState(profile?.education_level || "");
  const [stream, setStream] = useState(profile?.stream || "");
  const [availableHours, setAvailableHours] = useState(profile?.available_hours_per_week || 10);
  const [primaryCommitment, setPrimaryCommitment] = useState(profile?.primary_commitment || "");
  const [preferredStudyTime, setPreferredStudyTime] = useState(profile?.preferred_study_time || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile.mutateAsync({
        display_name: displayName,
        phone,
        education_level: educationLevel,
        stream,
        available_hours_per_week: availableHours,
        primary_commitment: primaryCommitment,
        preferred_study_time: preferredStudyTime,
      });
      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
      onSave();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="How should we call you?"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Mobile Number</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Your mobile number"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="education">Education Level</Label>
        <Select value={educationLevel} onValueChange={setEducationLevel}>
          <SelectTrigger id="education" className="bg-background">
            <SelectValue placeholder="Select your education level" />
          </SelectTrigger>
          <SelectContent className="bg-background z-50">
            <SelectItem value="class-9-10">Class 9-10</SelectItem>
            <SelectItem value="class-11-12">Class 11-12</SelectItem>
            <SelectItem value="undergraduate">Undergraduate</SelectItem>
            <SelectItem value="postgraduate">Postgraduate</SelectItem>
            <SelectItem value="graduate">Graduate / Working</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="stream">Stream / Background</Label>
        <Input
          id="stream"
          value={stream}
          onChange={(e) => setStream(e.target.value)}
          placeholder="e.g., Science, Commerce, Engineering"
        />
      </div>

      <div className="space-y-2">
        <Label>Available Hours per Week: {availableHours}h</Label>
        <Slider
          value={[availableHours]}
          onValueChange={(value) => setAvailableHours(value[0])}
          min={1}
          max={50}
          step={1}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1h</span>
          <span>50h</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="commitment">Primary Commitment</Label>
        <Select value={primaryCommitment} onValueChange={setPrimaryCommitment}>
          <SelectTrigger id="commitment" className="bg-background">
            <SelectValue placeholder="What's your main commitment?" />
          </SelectTrigger>
          <SelectContent className="bg-background z-50">
            <SelectItem value="school">School</SelectItem>
            <SelectItem value="college">College</SelectItem>
            <SelectItem value="job">Full-time Job</SelectItem>
            <SelectItem value="coaching">Coaching / Preparation</SelectItem>
            <SelectItem value="freelance">Freelance / Part-time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Preferred Study Time</Label>
        <div className="flex gap-2">
          {["Morning", "Afternoon", "Evening", "Night"].map((time) => (
            <Button
              key={time}
              variant={preferredStudyTime === time.toLowerCase() ? "default" : "outline"}
              size="sm"
              onClick={() => setPreferredStudyTime(time.toLowerCase())}
              className="flex-1"
            >
              {time}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving} className="flex-1">
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}