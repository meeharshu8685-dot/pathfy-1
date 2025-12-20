import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  tokenCost: number;
  className?: string;
}

export function FeatureCard({ icon, title, description, href, tokenCost, className }: FeatureCardProps) {
  return (
    <Link to={href} className={cn("group block", className)}>
      <div className="h-full p-6 rounded-xl card-gradient border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            {icon}
          </div>
          <span className="text-xs font-mono px-2 py-1 rounded-md bg-secondary text-muted-foreground">
            {tokenCost} token{tokenCost > 1 ? 's' : ''}
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {description}
        </p>
        <div className="flex items-center text-sm text-primary font-medium">
          Get Started
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
