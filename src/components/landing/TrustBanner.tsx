"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, ShieldCheck } from "lucide-react";

export function TrustBanner() {
  const t = useTranslations("landing.trustBanner");
  const items = t.raw("items") as string[];

  return (
    <section className="border-y border-gray-100 bg-gray-50/30">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 
           Grid Layout:
           - Mobile: 1 column (stack) for very small screens, 2 columns for standard phones
           - Desktop: 4 columns (one line)
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {items.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center gap-3 py-4 px-2 group hover:bg-white transition-colors duration-200"
            >
              {/* Using a distinct icon for the last item (Money Back guarantee usually) if implied, 
                  otherwise standard checks */}
              <div className="flex-shrink-0 text-emerald-600 bg-emerald-100/50 rounded-full p-1">
                {index === 3 ? (
                    <ShieldCheck className="w-4 h-4" />
                ) : (
                    <CheckCircle2 className="w-4 h-4" />
                )}
              </div>
              
              <span className="text-sm font-medium text-gray-700 text-center sm:text-left leading-tight">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}