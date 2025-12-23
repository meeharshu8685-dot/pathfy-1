import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md rounded-xl",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md rounded-xl",
        outline: "border-2 border-border bg-transparent hover:bg-secondary/60 hover:border-primary/30 text-foreground rounded-xl",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl",
        ghost: "hover:bg-secondary/60 hover:text-foreground rounded-xl",
        link: "text-primary underline-offset-4 hover:underline",
        
        // Premium SaaS buttons
        hero: [
          "relative overflow-hidden rounded-2xl px-8 py-3",
          "bg-gradient-to-r from-primary via-primary to-accent",
          "text-primary-foreground font-semibold",
          "shadow-[0_4px_20px_hsl(var(--primary)/0.4)]",
          "hover:shadow-[0_8px_30px_hsl(var(--primary)/0.5)]",
          "hover:scale-[1.02]",
          "before:absolute before:inset-0",
          "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
          "before:translate-x-[-200%] hover:before:translate-x-[200%]",
          "before:transition-transform before:duration-700",
        ].join(" "),
        
        gradient: [
          "relative overflow-hidden rounded-xl",
          "bg-gradient-to-r from-primary to-accent",
          "text-primary-foreground font-semibold",
          "shadow-md hover:shadow-lg",
          "hover:scale-[1.02]",
        ].join(" "),
        
        glow: [
          "relative rounded-xl",
          "bg-primary text-primary-foreground",
          "shadow-[0_0_20px_hsl(var(--primary)/0.4)]",
          "hover:shadow-[0_0_40px_hsl(var(--primary)/0.6)]",
          "hover:bg-primary/90",
        ].join(" "),
        
        glass: [
          "rounded-xl",
          "bg-background/60 backdrop-blur-xl",
          "border border-border/50",
          "text-foreground",
          "hover:bg-background/80 hover:border-border",
          "shadow-sm hover:shadow-md",
        ].join(" "),
        
        soft: [
          "rounded-xl",
          "bg-primary/10 text-primary",
          "hover:bg-primary/20",
          "border border-primary/20",
        ].join(" "),
        
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-sm hover:shadow-md rounded-xl",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-sm hover:shadow-md rounded-xl",
        
        premium: [
          "relative overflow-hidden rounded-2xl",
          "bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500",
          "text-amber-950 font-bold",
          "shadow-[0_4px_20px_hsl(38_92%_50%/0.4)]",
          "hover:shadow-[0_8px_30px_hsl(38_92%_50%/0.5)]",
          "hover:scale-[1.02]",
        ].join(" "),
        
        dark: [
          "rounded-xl",
          "bg-foreground text-background",
          "hover:bg-foreground/90",
          "shadow-lg hover:shadow-xl",
        ].join(" "),
        
        minimal: [
          "rounded-lg",
          "text-foreground",
          "hover:text-primary",
          "underline-offset-4 hover:underline",
        ].join(" "),
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };