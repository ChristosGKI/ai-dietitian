"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap,
  Star
} from "lucide-react";
import { useRouter } from "@/i18n/routing"; 

import Image from "next/image";

// --- AVATAR STACK ---
function AvatarStack() {
  const avatars = ["avatar1.png", "avatar2.png", "avatar3.png", "avatar4.png"];
  
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="flex -space-x-3">
        {avatars.map((avatar, index) => (
          <div key={index} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative">
            <Image
              src={`/avatars/${avatar}`}
              alt={`User avatar ${index + 1}`}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <p className="text-xs font-medium text-gray-500">
          <span className="text-gray-900 font-bold">14,183+</span> plans generated
        </p>
      </div>
    </div>
  );
}

// --- RECEIPT COMPONENT ---
function ReceiptVisual({ label, price, isExpensive }: { label: string, price: string, isExpensive: boolean }) {
  return (
    <div className={`
      relative w-72 rounded-sm p-6 shadow-xl 
      ${isExpensive 
        ? "bg-gray-50 border border-gray-200 text-gray-400 rotate-[-6deg] z-0 scale-95 origin-bottom-right opacity-80" 
        : "bg-white border-t-8 border-t-emerald-500 text-gray-900 rotate-[3deg] z-10 ring-1 ring-gray-100"
      }
    `}>
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-4 h-4 rounded-full bg-gray-50/50" />)} 
      </div>

      <div className="flex justify-between items-start mb-6">
        <div className="text-xs font-bold uppercase tracking-widest opacity-50">
          {isExpensive ? "INVOICE #001" : "RECEIPT #AI-2025"}
        </div>
        {!isExpensive && <div className="text-emerald-600 font-bold text-xs uppercase bg-emerald-50 px-2 py-1 rounded">Paid</div>}
      </div>

      <div className="space-y-4 font-mono text-sm">
        <div className="flex justify-between">
          <span>Consultation</span>
          <span>{isExpensive ? "€120.00" : "€0.00"}</span>
        </div>
        <div className="flex justify-between">
          <span>Meal Plan</span>
          <span>{isExpensive ? "€30.00" : "€6.99"}</span>
        </div>
        <div className="border-t border-dashed border-gray-300 my-2 pt-2 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className={isExpensive ? "line-through decoration-red-500 decoration-2" : "text-emerald-600"}>
            {price}
          </span>
        </div>
      </div>

      {isExpensive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-0.5 bg-red-500 rotate-[-15deg] opacity-60" />
          <div className="w-full h-0.5 bg-red-500 rotate-[-15deg] translate-y-1 opacity-60" />
        </div>
      )}

      {!isExpensive && (
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
           <ShieldCheck className="w-4 h-4 text-emerald-500" />
           <span>One-time payment</span>
        </div>
      )}
    </div>
  );
}

export function HeroSection() {
  const t = useTranslations("landing.hero");
  const locale = useLocale();
  const router = useRouter();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-50/50 rounded-full blur-[100px] -z-10 opacity-60" />

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* --- LEFT COLUMN --- */}
          <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center lg:justify-start"
            >
              <AvatarStack />
            </motion.div>

            {/* SPLIT HEADLINE STRUCTURE */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-8"
            >
              <span className="block text-gray-900">Your Personal</span>
              <span className="block text-gray-900">Nutritionist</span>
              <span className="block text-emerald-600 mt-1 md:mt-2">Without the €150 Fee.</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0"
            >
              {t("subhead")}
            </motion.p>

            {/* --- IMPROVED HALO BUTTON --- */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col items-center lg:items-start gap-6"
            >
              <div className="relative group">
                {/* THE HALO: Spinning Conic Gradient */}
                <div className="absolute -inset-1 rounded-full opacity-70 group-hover:opacity-100 transition duration-200 blur-sm bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 animate-tilt"></div>
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/onboarding", { locale });
                  }}
                  className="relative flex items-center justify-center gap-3 bg-gray-900 hover:bg-black text-white h-14 px-8 rounded-full font-bold text-lg transition-all active:scale-[0.98] w-full sm:w-auto min-w-[200px]"
                >
                  {t("cta")}
                  {/* ANIMATED ARROW: Moves right on hover */}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>

              {/* Risk Reversal */}
              <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-gray-400" />
                  No subscription
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-gray-400" />
                  Results in 2 mins
                </span>
              </div>
            </motion.div>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:flex items-center justify-center relative min-h-[500px]"
          >
            <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-emerald-100/40 to-blue-50/40 rounded-full blur-3xl" />

            <motion.div
              className="absolute right-12 top-12"
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: -40 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
               <ReceiptVisual label="Dietitian" price="€150.00" isExpensive={true} />
            </motion.div>

            <motion.div
              className="absolute right-20 top-32"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.8, type: "spring" }}
            >
               <div className="relative">
                 <ReceiptVisual label="Custom Plan" price="€6.99" isExpensive={false} />
                 
                 <motion.div 
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ delay: 1.2, type: "spring" }}
                   className="absolute -top-4 -right-4 bg-gray-900 text-white px-4 py-2 rounded-full font-bold shadow-xl border-2 border-white rotate-12 flex flex-col items-center leading-none"
                 >
                   <span className="text-[10px] text-emerald-400 uppercase tracking-wider mb-0.5">Save</span>
                   <span className="text-lg">€143</span>
                 </motion.div>
               </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}