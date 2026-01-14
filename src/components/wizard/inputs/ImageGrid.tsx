"use client";

import { cn } from "@/lib/utils";
import { WizardOption } from "@/types/wizard";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface ImageGridProps {
  options: WizardOption[];
  value: string[];
  onChange: (val: string[]) => void;
  className?: string;
}

export function ImageGrid({
  options,
  value,
  onChange,
  className,
}: ImageGridProps) {
  const t = useTranslations();

  const isSelected = (optionValue: string | number) => {
    return value.includes(optionValue.toString());
  };

  const handleToggle = (optionValue: string | number) => {
    const strValue = optionValue.toString();
    if (value.includes(strValue)) {
      onChange(value.filter((v) => v !== strValue));
    } else {
      onChange([...value, strValue]);
    }
  };

  return (
    <div
      className={cn(
        "grid grid-cols-3 gap-2 sm:grid-cols-4",
        className
      )}
    >
      {options.map((option) => {
        const selected = isSelected(option.value);

        return (
          <button
            key={option.id}
            onClick={() => handleToggle(option.value)}
            className={cn(
              "group relative aspect-square overflow-hidden rounded-lg border-2 transition-all duration-200",
              "hover:scale-[1.02]",
              selected
                ? "border-destructive ring-2 ring-destructive/20"
                : "border-border hover:border-primary/50"
            )}
          >
            {option.imageSrc ? (
              <Image
                src={option.imageSrc}
                alt={t(option.label)}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <span className="text-xs text-muted-foreground">
                  {option.label}
                </span>
              </div>
            )}

            {/* Selected overlay */}
            {selected && (
              <div className="absolute inset-0 flex items-center justify-center bg-destructive/60">
                <div className="flex flex-col items-center text-white">
                  <X className="h-8 w-8" />
                  <span className="mt-1 text-xs font-medium uppercase tracking-wider">
                    Excluded
                  </span>
                </div>
              </div>
            )}

            {/* Label at bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1">
              <span className="block truncate text-center text-[10px] text-white">
                {t(option.label)}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
