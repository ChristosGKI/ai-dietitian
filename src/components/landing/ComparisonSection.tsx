"use client";

import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { 
  Check, 
  Wallet, 
  Clock, 
  ShieldCheck, 
  Sparkles
} from "lucide-react";
import clsx from "clsx";

export function ComparisonSection() {
  const t = useTranslations("landing.comparison");
  const tRaw = useTranslations("landing.comparison.rows");

  const headers = [
    { text: t("headers.0"), sub: "Traditional", mobileLabel: "Dietitian" },
    { text: t("headers.1"), sub: "Do-it-yourself", mobileLabel: "Generic App" },
    { text: t("headers.2"), sub: "The Future", mobileLabel: "AI Plan" },
  ];

  const ROW_ICONS = [Wallet, Clock, ShieldCheck];

  const rows = [0, 1, 2].map((idx) => ({
    icon: ROW_ICONS[idx],
    label: tRaw(`${idx}.label`),
    values: [
      tRaw(`${idx}.values.0`), 
      tRaw(`${idx}.values.1`), 
      tRaw(`${idx}.values.2`), 
    ],
  }));

  return (
    <section className="py-24 bg-gray-50/50 overflow-hidden border-t border-gray-100 relative">
      {/* Decorative background blob */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-50/40 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 text-sm font-bold mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="uppercase tracking-wide text-[11px]">Why upgrade?</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6"
          >
            {t("title")}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto"
          >
            {t("subtitle")}
          </motion.p>
        </div>

        {/* --- DESKTOP VIEW (Unchanged - Perfect) --- */}
        <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_1.2fr] relative isolate">
          <div className="absolute top-[-30px] bottom-[77px] right-0 w-[calc(25%)] bg-white rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-emerald-100 ring-4 ring-emerald-50/50 z-0 hidden md:block" />
          
          <div className="pb-8 border-b border-gray-200/50"></div>
          
          {headers.map((h, i) => (
            <div key={i} className="pb-8 text-center border-b border-gray-200/50 z-10 px-2 relative">
              <span className={clsx("block font-bold text-lg mb-1 tracking-tight", i === 2 ? "text-emerald-700" : "text-gray-900")}>
                {h.text}
              </span>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{h.sub}</span>
              {i === 2 && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-emerald-200 uppercase tracking-widest">
                  Best Value
                </div>
              )}
            </div>
          ))}

          {rows.map((row, rowIdx) => (
            <Fragment key={rowIdx}>
              <div className="py-6 pr-4 flex items-center gap-4 border-b border-gray-200/50 z-10 group">
                <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-colors">
                  <row.icon className="w-5 h-5" />
                </div>
                <span className="font-semibold text-gray-700 text-[15px]">{row.label}</span>
              </div>
              <div className="py-6 px-2 flex items-center justify-center border-b border-gray-200/50 z-10">
                <span className="text-gray-400 font-medium text-[15px] decoration-gray-300 decoration-1 line-through">{row.values[0]}</span>
              </div>
              <div className="py-6 px-2 flex items-center justify-center border-b border-gray-200/50 z-10">
                <span className="text-gray-500 font-medium text-[15px]">{row.values[1]}</span>
              </div>
              <div className="py-6 px-2 flex flex-col items-center justify-center border-b border-emerald-50 z-10 relative group">
                <span className="font-bold text-gray-900 text-lg">{row.values[2]}</span>
                {rowIdx === 0 && <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full mt-2">SAVE €143</span>}
              </div>
            </Fragment>
          ))}
          
          <div className="pt-10 col-span-4 flex justify-center z-10">
             <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100/50">
                <Check className="w-4 h-4 stroke-[3px]" />
                <span>{t("footer")}</span>
             </div>
          </div>
        </div>


        {/* --- MOBILE VIEW (Re-designed: Vertical Stacks) --- */}
        <div className="md:hidden space-y-6">
          {rows.map((row, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* 1. Header: Icon + Title */}
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 bg-white">
                <div className="p-1.5 bg-gray-50 rounded-md text-emerald-600">
                    <row.icon className="w-4 h-4" />
                </div>
                <span className="font-bold text-gray-900 text-lg">{row.label}</span>
              </div>

              {/* 2. The "Old Way" (Competitors) - Side by Side */}
              <div className="px-5 py-4 bg-gray-50/50 grid grid-cols-2 gap-4 border-b border-gray-100">
                <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                     {headers[0].mobileLabel}
                   </p>
                   <p className="text-sm font-medium text-gray-400 line-through decoration-gray-300">
                     {row.values[0]}
                   </p>
                </div>
                <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                     {headers[1].mobileLabel}
                   </p>
                   <p className="text-sm font-medium text-gray-600">
                     {row.values[1]}
                   </p>
                </div>
              </div>

              {/* 3. The "New Way" (Your Plan) - Full Width Highlight */}
              <div className="px-5 py-5 bg-emerald-50/30 flex items-center justify-between relative overflow-hidden group">
                 {/* Subtle sparkle icon background */}
                 <div className="absolute right-[-10px] bottom-[-10px] text-emerald-100/50 rotate-12">
                   <Sparkles className="w-20 h-20" />
                 </div>

                 <div className="relative z-10">
                   <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                     <Sparkles className="w-3 h-3" />
                     Your Plan
                   </p>
                   <p className="text-xl font-extrabold text-gray-900 leading-tight">
                     {row.values[2]}
                   </p>
                 </div>

                 {idx === 0 && (
                   <div className="relative z-10 bg-white border border-emerald-100 shadow-sm text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md">
                     Save €143
                   </div>
                 )}
              </div>
            </div>
          ))}
          
          {/* Mobile Footer Note */}
          <div className="text-center pt-4 pb-8">
            <span className="inline-flex items-center gap-2 text-emerald-700 font-semibold text-xs bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
              <Check className="w-3 h-3" />
              {t("footer")}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}