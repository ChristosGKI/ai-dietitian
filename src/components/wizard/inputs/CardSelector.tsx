"use client";

import { cn } from "@/lib/utils";
import { WizardOption } from "@/types/wizard";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import * as React from "react";

interface CardSelectorProps {
  options: WizardOption[];
  value: string | string[];
  onChange: (val: string | string[]) => void;
  multiSelect?: boolean;
  className?: string;
}

export function CardSelector({
  options,
  value,
  onChange,
  multiSelect = false,
  className,
}: CardSelectorProps) {
  const t = useTranslations();

  const isSelected = (optionValue: string | number) => {
    if (multiSelect && Array.isArray(value)) {
      return value.includes(optionValue.toString());
    }
    return value === optionValue.toString();
  };

  const handleSelect = (optionValue: string | number) => {
    const strValue = optionValue.toString();
    if (multiSelect) {
      const currentArray = Array.isArray(value) ? value : [];
      if (currentArray.includes(strValue)) {
        onChange(currentArray.filter((v) => v !== strValue));
      } else {
        onChange([...currentArray, strValue]);
      }
    } else {
      onChange(strValue);
    }
  };

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-3",
        className
      )}
    >
      {options.map((option) => {
        const selected = isSelected(option.value);
        const IconComponent = getLucideIcon(option.icon);

        return (
          <button
            key={option.id}
            onClick={() => handleSelect(option.value)}
            className={cn(
              "group relative flex flex-col items-center rounded-xl border-2 p-4 text-center transition-all duration-200",
              "hover:border-primary/50 hover:bg-accent/50",
              selected
                ? "border-primary bg-primary/5"
                : "border-border bg-card"
            )}
          >
            {selected && (
              <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                <Check className="h-3 w-3" />
              </div>
            )}

            <div className="mb-3 flex h-16 w-full items-center justify-center overflow-hidden rounded-lg bg-muted">
              {option.imageSrc ? (
                <Image
                  src={option.imageSrc}
                  alt={t(option.label)}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              ) : IconComponent ? (
                <IconComponent className="h-8 w-8 text-muted-foreground transition-colors group-hover:text-primary" />
              ) : null}
            </div>

            <div className="space-y-1">
              <span className="block text-sm font-medium">
                {t(option.label)}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// Helper function to get Lucide icon component from string name
function getLucideIcon(iconName?: string): React.ElementType | null {
  if (!iconName) return null;

  const icons: Record<string, React.ElementType> = {
    Apple: require("lucide-react").Apple,
    Utensils: require("lucide-react").Utensils,
    ChefHat: require("lucide-react").ChefHat,
    Activity: require("lucide-react").Activity,
    Heart: require("lucide-react").Heart,
    Scale: require("lucide-react").Scale,
    User: require("lucide-react").User,
    Calendar: require("lucide-react").Calendar,
    Clock: require("lucide-react").Clock,
    Target: require("lucide-react").Target,
    Zap: require("lucide-react").Zap,
    Moon: require("lucide-react").Moon,
    Sun: require("lucide-react").Sun,
    Leaf: require("lucide-react").Leaf,
    Shield: require("lucide-react").Shield,
    Check: require("lucide-react").Check,
    X: require("lucide-react").X,
    Plus: require("lucide-react").Plus,
    Minus: require("lucide-react").Minus,
    Star: require("lucide-react").Star,
    Flame: require("lucide-react").Flame,
    Droplets: require("lucide-react").Droplets,
    Wheat: require("lucide-react").Wheat,
    Fish: require("lucide-react").Fish,
    Beef: require("lucide-react").Beef,
    Milk: require("lucide-react").Milk,
    Egg: require("lucide-react").Egg,
    Nut: require("lucide-react").Nut,
    Search: require("lucide-react").Search,
  };

  return icons[iconName] || null;
}
