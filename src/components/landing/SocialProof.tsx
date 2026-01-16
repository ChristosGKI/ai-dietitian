"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Star, Quote, CheckCircle2, ArrowRight } from "lucide-react";

// Helper to render 5 stars
function StarRating() {
  return (
    <div className="flex gap-0.5 mb-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export function SocialProof() {
  const t = useTranslations("landing.socialProof");
  const router = useRouter();
  
  const reviews = t.raw("reviews") as Array<{ author: string; text: string }>;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent opacity-50" />
      <div className="absolute -top-[200px] -right-[200px] w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-[200px] -left-[200px] w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full text-emerald-800 text-xs font-bold uppercase tracking-wider mb-6">
            <Star className="w-3 h-3 fill-emerald-700 text-emerald-700" />
            Trusted Results
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4 tracking-tight">
            {t("headline")}
          </h2>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-gray-50 rounded-2xl p-8 relative group hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 border border-transparent hover:border-emerald-100"
            >
              {/* Background Quote Icon */}
              <Quote className="absolute top-6 right-6 w-12 h-12 text-emerald-100/50 group-hover:text-emerald-50 transition-colors" />

              <StarRating />
              
              <blockquote className="relative z-10 mb-6">
                <p className="text-gray-700 leading-relaxed font-medium">
                  "{review.text}"
                </p>
              </blockquote>

              <div className="flex items-center gap-3 border-t border-gray-200/50 pt-4 mt-auto">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {review.author.split("•")[0]}
                  </p>
                  <div className="flex items-center gap-1.5">
                    {review.author.includes("•") && (
                      <span className="text-xs text-gray-500">
                        {review.author.split("•")[1]}
                      </span>
                    )}
                    <span className="text-emerald-500" title="Verified User">
                      <CheckCircle2 className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Area */}
        <div className="mt-20 text-center">
           <button
             onClick={() => router.push("/onboarding")}
             className="group relative inline-flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white text-lg font-semibold px-10 py-4 rounded-xl shadow-xl shadow-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200"
           >
             {t("cta")}
             <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
           </button>
           
           <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-sm text-gray-500">
             <span className="flex items-center gap-1.5">
               <CheckCircle2 className="w-4 h-4 text-emerald-500" />
               One-time payment
             </span>
             <span className="hidden md:block w-1 h-1 bg-gray-300 rounded-full" />
             <span className="flex items-center gap-1.5">
               <CheckCircle2 className="w-4 h-4 text-emerald-500" />
               No subscription
             </span>
             <span className="hidden md:block w-1 h-1 bg-gray-300 rounded-full" />
             <span className="flex items-center gap-1.5">
               <CheckCircle2 className="w-4 h-4 text-emerald-500" />
               Instant delivery
             </span>
           </div>
        </div>

      </div>
    </section>
  );
}