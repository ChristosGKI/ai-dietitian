"use client";

import { cn } from "@/lib/utils";
import { ChefHat, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

interface VisualRatingProps {
  max?: number;
  value: number;
  onChange: (val: number) => void;
  labels: Record<number, string>;
  className?: string;
  icon?: "star" | "chefHat";
}

export function VisualRating({
  max = 5,
  value,
  onChange,
  labels,
  className,
  icon = "star",
}: VisualRatingProps) {
  const t = useTranslations();
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const displayValue = hoverValue !== null ? hoverValue : value;

  const IconComponent = icon === "chefHat" ? ChefHat : Star;

  const handleClick = (rating: number) => {
    onChange(rating);
  };

  const handleMouseEnter = (rating: number) => {
    setHoverValue(rating);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Icon row */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: max }, (_, i) => i + 1).map((rating) => {
          const isActive = rating <= displayValue;

          return (
            <button
              key={rating}
              onClick={() => handleClick(rating)}
              onMouseEnter={() => handleMouseEnter(rating)}
              onMouseLeave={handleMouseLeave}
              className={cn(
                "group relative rounded-full p-3 transition-all duration-200",
                "hover:scale-110",
                isActive
                  ? "text-amber-500"
                  : "text-muted-foreground/30"
              )}
            >
              <IconComponent
                className={cn(
                  "h-10 w-10 transition-all duration-200",
                  isActive && "fill-current"
                )}
              />
            </button>
          );
        })}
      </div>

      {/* Current value label */}
      <div className="text-center">
        <span className="text-lg font-medium text-foreground">
          {labels[value] ? t(labels[value]) : value}
        </span>
      </div>
    </div>
  );
}
