import { BookOpen, Video, Globe, FileText, Users } from "lucide-react";

interface Resource {
  title: string;
  type: string;
  reason: string;
}

interface ResourcesListProps {
  resources: Resource[];
}

const typeIcons: Record<string, typeof BookOpen> = {
  book: BookOpen,
  video: Video,
  course: Globe,
  article: FileText,
  community: Users,
};

export function ResourcesList({ resources }: ResourcesListProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground">Recommended Resources</h4>
      
      <div className="space-y-2">
        {resources.map((resource, index) => {
          const Icon = typeIcons[resource.type.toLowerCase()] || BookOpen;
          
          return (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50"
            >
              <div className="p-2 rounded-md bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{resource.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{resource.reason}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground capitalize">
                {resource.type}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
