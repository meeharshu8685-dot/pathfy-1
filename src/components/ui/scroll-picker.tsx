import * as React from "react";
import { cn } from "@/lib/utils";

interface ScrollPickerProps {
  values: (string | number)[];
  value: string | number;
  onChange: (value: string | number) => void;
  className?: string;
  itemHeight?: number;
}

export function ScrollPicker({
  values,
  value,
  onChange,
  className,
  itemHeight = 40,
}: ScrollPickerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = React.useState(false);
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout>();

  const currentIndex = values.indexOf(value);

  React.useEffect(() => {
    if (containerRef.current && !isScrolling) {
      const scrollTop = currentIndex * itemHeight;
      containerRef.current.scrollTo({
        top: scrollTop,
        behavior: "smooth",
      });
    }
  }, [currentIndex, itemHeight, isScrolling]);

  const handleScroll = React.useCallback(() => {
    if (!containerRef.current) return;

    setIsScrolling(true);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (!containerRef.current) return;

      const scrollTop = containerRef.current.scrollTop;
      const index = Math.round(scrollTop / itemHeight);
      const clampedIndex = Math.max(0, Math.min(index, values.length - 1));

      if (values[clampedIndex] !== value) {
        onChange(values[clampedIndex]);
      }

      // Snap to position
      containerRef.current.scrollTo({
        top: clampedIndex * itemHeight,
        behavior: "smooth",
      });

      setIsScrolling(false);
    }, 100);
  }, [itemHeight, onChange, value, values]);

  const handleItemClick = (index: number) => {
    onChange(values[index]);
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * itemHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* Gradient overlays */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

      {/* Selection highlight */}
      <div
        className="absolute left-1 right-1 bg-primary/10 rounded-lg border border-primary/20 pointer-events-none z-0"
        style={{
          top: itemHeight,
          height: itemHeight,
        }}
      />

      {/* Scrollable container */}
      <div
        ref={containerRef}
        className="overflow-y-auto scrollbar-hide relative z-5"
        style={{
          height: itemHeight * 3,
          paddingTop: itemHeight,
          paddingBottom: itemHeight,
        }}
        onScroll={handleScroll}
      >
        {values.map((v, index) => {
          const isSelected = v === value;
          return (
            <div
              key={`${v}-${index}`}
              className={cn(
                "flex items-center justify-center cursor-pointer transition-all duration-200",
                isSelected
                  ? "text-primary font-semibold scale-105"
                  : "text-muted-foreground hover:text-foreground"
              )}
              style={{ height: itemHeight }}
              onClick={() => handleItemClick(index)}
            >
              {v}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface DualScrollPickerProps {
  numberValue: number;
  unitValue: string;
  onNumberChange: (value: number) => void;
  onUnitChange: (value: string) => void;
  numberRange?: { min: number; max: number };
  units?: { value: string; label: string }[];
  className?: string;
}

export function DualScrollPicker({
  numberValue,
  unitValue,
  onNumberChange,
  onUnitChange,
  numberRange = { min: 1, max: 36 },
  units = [
    { value: "weeks", label: "Weeks" },
    { value: "months", label: "Months" },
  ],
  className,
}: DualScrollPickerProps) {
  const numbers = React.useMemo(() => {
    const arr = [];
    for (let i = numberRange.min; i <= numberRange.max; i++) {
      arr.push(i);
    }
    return arr;
  }, [numberRange.min, numberRange.max]);

  return (
    <div
      className={cn(
        "flex items-center gap-2 p-4 rounded-xl bg-secondary/30 border border-border",
        className
      )}
    >
      <ScrollPicker
        values={numbers}
        value={numberValue}
        onChange={(v) => onNumberChange(v as number)}
        className="flex-1 min-w-[80px]"
      />
      <div className="w-px h-20 bg-border" />
      <ScrollPicker
        values={units.map((u) => u.label)}
        value={units.find((u) => u.value === unitValue)?.label || units[0].label}
        onChange={(v) => {
          const unit = units.find((u) => u.label === v);
          if (unit) onUnitChange(unit.value);
        }}
        className="flex-1 min-w-[100px]"
      />
    </div>
  );
}
