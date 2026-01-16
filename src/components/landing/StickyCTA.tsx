"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "@/i18n/routing"; 

export function StickyCTA() {
  const t = useTranslations("landing.stickyCTA");
  const locale = useLocale();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero (approx 600px)
      setIsVisible(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/onboarding", { locale });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          {/* Glassmorphism Dock */}
          <div className="bg-white/90 backdrop-blur-md border-t border-gray-200 px-4 pt-3 pb-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <button
              onClick={handleCtaClick}
              className="w-full bg-emerald-600 active:bg-emerald-700 text-white font-bold text-lg py-3.5 px-6 rounded-xl shadow-md flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
            >
              <span>{t("button")}</span>
              
              {/* The "Nag" Animation */}
              {/* Moves the arrow right, then back, every few seconds */}
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  repeatDelay: 2.5 // Waits 2.5s between nags so it's not frantic
                }}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}