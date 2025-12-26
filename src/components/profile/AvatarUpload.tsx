import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, User, Grid, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AVATAR_PRESETS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aria",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
];

interface AvatarUploadProps {
  size?: "sm" | "md" | "lg";
  editable?: boolean;
}

export function AvatarUpload({ size = "lg", editable = true }: AvatarUploadProps) {
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const getInitials = () => {
    const name = profile?.display_name || profile?.full_name || user?.email;
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 2MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Delete old avatar if exists
      if (profile?.avatar_url) {
        const oldPath = profile.avatar_url.split("/avatars/")[1];
        if (oldPath) {
          await supabase.storage.from("avatars").remove([oldPath]);
        }
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      // Update profile with new avatar URL (add cache buster)
      await updateProfile.mutateAsync({
        avatar_url: `${publicUrl}?t=${Date.now()}`
      });

      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated.",
      });
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handlePresetSelect = async (url: string) => {
    setIsUploading(true);
    try {
      await updateProfile.mutateAsync({ avatar_url: url });
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated to the selected preset.",
      });
    } catch (error) {
      console.error("Preset selection error:", error);
      toast({
        title: "Update failed",
        description: "Failed to update avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <Avatar className={`${sizeClasses[size]} border-2 border-border`}>
        <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
          {getInitials()}
        </AvatarFallback>
      </Avatar>

      {editable && (
        <div className="absolute -bottom-1 -right-1 flex gap-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            disabled={isUploading}
          />

          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="w-7 h-7 rounded-full shadow-md hover:bg-primary hover:text-primary-foreground transition-colors"
                disabled={isUploading}
              >
                <Grid className="w-3 h-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-border/50">
              <DialogHeader>
                <DialogTitle>Choose Your Avatar</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-5 gap-4 py-8">
                {AVATAR_PRESETS.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => handlePresetSelect(url)}
                    className={`relative rounded-full overflow-hidden border-2 transition-all hover:scale-110 active:scale-95 ${profile?.avatar_url === url
                        ? "border-primary ring-2 ring-primary/20 scale-110"
                        : "border-transparent hover:border-primary/50"
                      }`}
                  >
                    <img src={url} alt={`Preset ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="border-t border-border/50 pt-6">
                <p className="text-sm text-muted-foreground mb-4 text-center">Or upload your own</p>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  Upload Custom Image
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            size="icon"
            variant="secondary"
            className="w-7 h-7 rounded-full shadow-md hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Camera className="w-3 h-3" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
