"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ShieldCheck, Lock, CreditCard } from "lucide-react";

export function CredibilityFooter() {
  const t = useTranslations("landing.footer");

  const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link 
      href={href} 
      className="text-gray-500 hover:text-emerald-600 transition-colors text-xs md:text-sm font-medium"
    >
      {children}
    </Link>
  );

  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-24 md:pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* --- ROW 1: BRAND & TRUST SIGNALS --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-xl font-bold text-gray-900 tracking-tight mb-2">
              AI Dietitian<span className="text-emerald-500">.</span>
            </span>
            <p className="text-sm text-gray-500 max-w-xs">
              Science-based nutrition planning powered by artificial intelligence.
            </p>
          </div>

          {/* Payment & Security Column */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="flex items-center gap-2 text-gray-400">
               {/* Simulated Payment Icons */}
               <div className="h-6 w-10 bg-white border border-gray-200 rounded flex items-center justify-center" title="Visa">
                 <span className="text-[8px] font-bold text-blue-800 font-serif italic">VISA</span>
               </div>
               <div className="h-6 w-10 bg-white border border-gray-200 rounded flex items-center justify-center" title="Mastercard">
                 <div className="flex -space-x-1">
                   <div className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80" />
                 </div>
               </div>
               <div className="h-6 w-10 bg-white border border-gray-200 rounded flex items-center justify-center" title="Apple Pay">
                 <span className="text-[8px] font-bold text-black">Pay</span>
               </div>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
              <Lock className="w-3 h-3" />
              <span className="font-medium">256-bit SSL Secure Payment</span>
            </div>
          </div>
        </div>

        {/* --- ROW 2: DIVIDER --- */}
        <div className="w-full h-px bg-gray-200 mb-8" />

        {/* --- ROW 3: LEGAL LINKS & COPYRIGHT --- */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6 mb-8">
          <p className="text-xs text-gray-400">
            {t("line2")}
          </p>

          <nav className="flex flex-wrap justify-center gap-6 md:gap-8">
            <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
            <FooterLink href="/terms-of-service">Terms of Service</FooterLink>
            <FooterLink href="/cookie-policy">Cookie Policy</FooterLink>
            <FooterLink href="/contact">Contact Support</FooterLink>
          </nav>
        </div>

        {/* --- ROW 4: DISCLAIMER (The Fine Print) --- */}
        <div className="bg-gray-100/50 rounded-xl p-6 border border-gray-200/50">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-700 block uppercase tracking-wider">
                Medical Disclaimer
              </span>
              <p className="text-xs text-gray-500 leading-relaxed text-justify md:text-left">
                {t("disclaimer")}
              </p>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}