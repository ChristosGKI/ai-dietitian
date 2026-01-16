"use client";

import { useTranslations } from "next-intl";
import { Timer } from "lucide-react";

export function UrgencyBanner() {
  const t = useTranslations("landing.urgencyBanner");

  return (
    <div className="w-full bg-emerald-600 text-white relative z-50 overflow-hidden">
      <div className="container mx-auto px-4 py-2.5 flex items-center justify-center gap-2 relative z-10">
        <Timer className="w-4 h-4 text-emerald-100 animate-pulse" />
        <p className="text-center text-xs md:text-sm font-medium tracking-wide">
          {t("text")}
        </p>
      </div>
    </div>
  );
}