"use client";

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface ModernSliderProps {
  min: number;
  max: number;
  step?: number;
  unit?: string;
  value: number;
  onChange: (val: number) => void;
  className?: string;
  showMinMax?: boolean;
}

export function ModernSlider({
  min,
  max,
  step = 1,
  unit = "",
  value,
  onChange,
  className,
  showMinMax = true,
}: ModernSliderProps) {
  const handleValueChange = (newValue: number[]) => {
    onChange(newValue[0]);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Large value display */}
      <div className="text-center">
        <span className="text-5xl font-bold tracking-tight text-primary">
          {value}
        </span>
        {unit && (
          <span className="ml-2 text-2xl font-medium text-muted-foreground">
            {unit}
          </span>
        )}
      </div>

      {/* Slider */}
      <Slider
        value={[value]}
        onValueChange={handleValueChange}
        min={min}
        max={max}
        step={step}
        className="py-4"
      />

      {/* Min/Max labels */}
      {showMinMax && (
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            {min}
            {unit}
          </span>
          <span>
            {max}
            {unit}
          </span>
        </div>
      )}
    </div>
  );
}
