"use client";

import { useTranslations } from "next-intl";
import { MessageCircleQuestion, Plus, Minus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  const t = useTranslations("landing.faq");
  const items = t.raw("items") as Array<{ q: string; a: string }>;

  return (
    <section className="py-24 bg-gray-50/50 relative overflow-hidden">
      {/* Decorative Background Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-50/60 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 text-xs font-bold uppercase tracking-wider mb-6">
            <MessageCircleQuestion className="w-4 h-4 text-emerald-600" />
            <span>Support</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-gray-500 text-lg">
            {t("subtitle")}
          </p>
        </div>

        {/* --- SHADCN ACCORDION --- */}
        <Accordion type="single" collapsible defaultValue="item-0" className="space-y-4">
          {items.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="group border border-gray-200 bg-white rounded-2xl px-2 shadow-sm transition-all duration-200 data-[state=open]:border-emerald-500 data-[state=open]:ring-1 data-[state=open]:ring-emerald-500 data-[state=open]:shadow-md data-[state=open]:shadow-emerald-500/10"
            >
              <AccordionTrigger className="px-4 py-5 hover:no-underline hover:bg-gray-50/50 rounded-xl transition-colors [&[data-state=open]>div>svg]:rotate-180">
                <div className="flex items-center justify-between w-full">
                  <span className="text-left font-semibold text-gray-900 text-lg group-data-[state=open]:text-emerald-700 transition-colors">
                    {item.q}
                  </span>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-4 pb-6 pt-0">
                <div className="pt-4 border-t border-dashed border-gray-100">
                  <p className="text-gray-600 leading-relaxed text-base">
                    {item.a}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}