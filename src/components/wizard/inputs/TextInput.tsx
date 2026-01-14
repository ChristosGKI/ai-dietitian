"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { ChangeEvent } from "react";

interface TextInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: "text" | "email";
  label?: string;
  className?: string;
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  label,
  className,
}: TextInputProps) {
  const t = useTranslations();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={label} className="text-base">
          {t(label)}
        </Label>
      )}
      <Input
        id={label}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder ? t(placeholder) : undefined}
        className="h-12 text-base"
      />
    </div>
  );
}

export default TextInput;
