"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  FileText, 
  Calendar, 
  ChefHat, 
  ShoppingCart, 
  ArrowRight,
  UtensilsCrossed,
  Sparkles
} from "lucide-react";

// --- REUSABLE PHONE SHELL ---
function PhoneShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative w-[300px] md:w-[320px] mx-auto ${className}`}>
      {/* Frame */}
      <div className="relative bg-gray-900 rounded-[3rem] p-1 shadow-[0_50px_100px_-20px_rgba(50,50,93,0.25),0_30px_60px_-30px_rgba(0,0,0,0.3)] border-[8px] border-gray-900 ring-1 ring-gray-700/50">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20" />
        <div className="bg-white rounded-[2.5rem] overflow-hidden h-[600px] relative w-full flex flex-col">
          {children}
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-gray-100/20 rounded-full z-20 mix-blend-difference" />
      </div>
    </div>
  );
}

// --- SCREEN 1: MEAL PLAN ---
function MealPlanScreen() {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="pt-16 px-6 pb-6 bg-emerald-600 rounded-b-[2.5rem] shadow-xl shadow-emerald-900/10">
        <div className="flex items-center justify-between text-white mb-6">
          <div>
            <p className="text-emerald-100 text-sm font-medium">Thursday, 12 Oct</p>
            <h3 className="text-2xl font-bold">Your Plan</h3>
          </div>
          <div className="w-10 h-10 bg-emerald-500/30 backdrop-blur rounded-full flex items-center justify-center">
             <Calendar className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="flex justify-between bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white">
          <div className="text-center">
            <p className="text-xs text-emerald-100 opacity-80">Protein</p>
            <p className="font-bold">180g</p>
          </div>
          <div className="w-px bg-white/20"></div>
          <div className="text-center">
            <p className="text-xs text-emerald-100 opacity-80">Carbs</p>
            <p className="font-bold">220g</p>
          </div>
          <div className="w-px bg-white/20"></div>
          <div className="text-center">
            <p className="text-xs text-emerald-100 opacity-80">Fat</p>
            <p className="font-bold">65g</p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-4 overflow-hidden">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Today's Meals</p>
        {[
          { icon: "🥞", name: "Protein Pancakes", cal: "450 kcal", time: "Breakfast" },
          { icon: "🥗", name: "Quinoa Power Bowl", cal: "620 kcal", time: "Lunch" },
          { icon: "🥩", name: "Garlic Butter Steak", cal: "850 kcal", time: "Dinner" }
        ].map((meal, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">
              {meal.icon}
            </div>
            <div>
              <p className="text-xs text-emerald-600 font-bold uppercase">{meal.time}</p>
              <p className="font-bold text-gray-900">{meal.name}</p>
              <p className="text-xs text-gray-400">{meal.cal}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- SCREEN 2: GROCERY LIST ---
function GroceryScreen() {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="pt-16 px-6 pb-4 border-b border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900">Grocery List</h3>
        <p className="text-gray-500 text-sm">Organized by aisle</p>
      </div>
      <div className="p-6 space-y-6">
        {[
          { aisle: "Produce", items: ["Spinach", "Avocados (2)", "Sweet Potato"] },
          { aisle: "Butcher", items: ["Sirloin Steak (500g)", "Chicken Breast"] },
          { aisle: "Dairy", items: ["Greek Yogurt", "Eggs (12)"] },
        ].map((section, i) => (
          <div key={i}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <h4 className="font-bold text-gray-900">{section.aisle}</h4>
            </div>
            <div className="space-y-2 pl-4 border-l-2 border-gray-100">
              {section.items.map((item, j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${j === 0 ? "bg-emerald-500 border-emerald-500" : "border-gray-300"}`}>
                    {j === 0 && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-sm ${j === 0 ? "text-gray-400 line-through" : "text-gray-700"}`}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductShowcase() {
  const t = useTranslations("landing.showcase");
  const router = useRouter();
  
  const bullets = t.raw("bullets");

  // We split the title manually here to control the design
  // Assuming t("title") is "Your Perfect Meal Plan, Ready in Minutes"
  const titleParts = t("title").split(","); 

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* --- IMPROVED HEADER --- */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
          
          {/* Eyebrow Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold mb-8"
          >
            <Sparkles className="w-4 h-4 fill-emerald-200" />
            <span className="uppercase tracking-wide text-[11px]">See the magic inside</span>
          </motion.div>

          {/* Main Title Split */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1]"
          >
            {/* Fallback if split fails, otherwise render styled parts */}
            {titleParts.length > 1 ? (
              <>
                {titleParts[0]},
                <br className="hidden md:block" />
                <span className="text-emerald-600 block md:inline mt-2 md:mt-0 decoration-emerald-200 underline-offset-4 decoration-4">
                 {titleParts[1]}
                </span>
              </>
            ) : (
              t("title")
            )}
          </motion.h2>
        </div>

        {/* --- ROW 1: THE PLAN --- */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 space-y-12"
          >
            {bullets.slice(0, 2).map((text: string, i: number) => (
              <div key={i} className="flex gap-5">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  {i === 0 && <UtensilsCrossed className="w-6 h-6 text-emerald-600" />}
                  {i === 1 && <FileText className="w-6 h-6 text-emerald-600" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {i === 0 ? "Precision Macros" : "7-Day Roadmap"}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex-1 relative"
          >
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-emerald-100/50 to-blue-50/50 rounded-full blur-3xl -z-10" />
             <motion.div
               animate={{ y: [-10, 10, -10] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             >
               <PhoneShell>
                 <MealPlanScreen />
               </PhoneShell>
             </motion.div>
          </motion.div>
        </div>

        {/* --- ROW 2: THE EXECUTION --- */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 space-y-12"
          >
            {bullets.slice(2, 4).map((text: string, i: number) => (
              <div key={i} className="flex gap-5">
                 <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  {i === 0 && <ChefHat className="w-6 h-6 text-blue-600" />}
                  {i === 1 && <ShoppingCart className="w-6 h-6 text-blue-600" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {i === 0 ? "Chef-Grade Recipes" : "Smart Grocery List"}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex-1 relative"
          >
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tl from-blue-100/50 to-purple-50/50 rounded-full blur-3xl -z-10" />
             <motion.div
               animate={{ y: [10, -10, 10] }}
               transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
             >
               <PhoneShell>
                 <GroceryScreen />
               </PhoneShell>
             </motion.div>
          </motion.div>
        </div>

        {/* --- BOTTOM CTA --- */}
        <div className="mt-32 text-center">
          <Button
            onClick={() => router.push("/onboarding")}
            size="lg"
            className="bg-gray-900 hover:bg-black text-white text-lg px-12 py-8 h-auto font-bold rounded-2xl shadow-2xl hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            {t("cta")}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="mt-6 text-sm text-gray-400 font-medium">
            Compatible with any dietary preference (Vegan, Keto, Paleo, etc.)
          </p>
        </div>

      </div>
    </section>
  );
}