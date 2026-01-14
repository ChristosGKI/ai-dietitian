"use client";

import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { WizardOption } from "@/types/wizard";
import { Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

interface SearchListProps {
  options: WizardOption[];
  value: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
  className?: string;
  emptyMessage?: string;
}

export function SearchList({
  options,
  value,
  onChange,
  placeholder,
  className,
  emptyMessage,
}: SearchListProps) {
  const t = useTranslations();
  const [open, setOpen] = React.useState(false);

  const handleSelect = (currentValue: string) => {
    if (value.includes(currentValue)) {
      onChange(value.filter((v) => v !== currentValue));
    } else {
      onChange([...value, currentValue]);
    }
    setOpen(false);
  };

  const handleRemove = (valueToRemove: string) => {
    onChange(value.filter((v) => v !== valueToRemove));
  };

  const getSelectedOption = (optionValue: string) => {
    return options.find((opt) => opt.value.toString() === optionValue);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Selected items as badges */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((val) => {
            const option = getSelectedOption(val);
            return (
              <Badge
                key={val}
                variant="secondary"
                className="gap-1.5 px-3 py-1"
              >
                {option ? t(option.label) : val}
                <button
                  onClick={() => handleRemove(val)}
                  className="ml-1 rounded-full hover:bg-muted p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Command combobox */}
      <Command className="w-full">
        <CommandInput
          placeholder={placeholder || t("wizard.searchPlaceholder")}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
        />

        {open && (
          <div className="relative">
            <CommandList className="absolute left-0 top-2 z-50 w-full rounded-md border bg-popover shadow-lg">
              <CommandEmpty>
                {emptyMessage || t("wizard.noResults")}
              </CommandEmpty>

              <CommandGroup heading={t("wizard.availableOptions")}>
                {options.map((option) => {
                  const isSelected = value.includes(option.value.toString());
                  return (
                    <CommandItem
                      key={option.id}
                      value={option.value.toString()}
                      onSelect={() => handleSelect(option.value.toString())}
                      className="flex items-center gap-2"
                    >
                      <div
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-sm border",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "border-muted-foreground/20"
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      <span>{t(option.label)}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </div>
        )}
      </Command>
    </div>
  );
}
