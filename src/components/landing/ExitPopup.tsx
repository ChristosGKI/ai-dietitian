"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { X, Tag, ArrowRight } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function ExitPopup() {
  const t = useTranslations("landing.exitPopup")
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)
  
  // Use a ref to track "seen" status without triggering re-renders of the effect
  const hasTriggeredRef = React.useRef(false)

  React.useEffect(() => {
    // Check session storage on mount
    const alreadySeen = sessionStorage.getItem("hasSeenExitPopup")
    if (alreadySeen) {
      hasTriggeredRef.current = true
      return
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (
        e.clientY < 10 && // Cursor hits top of viewport
        !hasTriggeredRef.current && 
        !document.querySelector('[role="dialog"]') // Don't fire if another modal is open
      ) {
        hasTriggeredRef.current = true
        sessionStorage.setItem("hasSeenExitPopup", "true")
        setIsOpen(true)
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)
    return () => document.removeEventListener("mouseleave", handleMouseLeave)
  }, [])

  const handlePrimaryAction = () => {
    setIsOpen(false)
    router.push("/onboarding")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden gap-0 border-0 shadow-2xl">
        <DialogTitle className="sr-only"></DialogTitle>
        {/* Visual Header with "Special Offer" vibe */}
        <div className="bg-emerald-600 p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Tag className="w-24 h-24 text-white rotate-12" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center gap-3">
             <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl">🎁</span>
             </div>
             <h3 className="text-white font-bold text-xl tracking-tight leading-snug">
               {t("title")}
             </h3>
          </div>
        </div>

        <div className="p-6 bg-white">
          <DialogHeader className="mb-6">
            <DialogDescription className="text-center text-gray-600 text-base">
              {t("body")}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col gap-3 sm:flex-col sm:space-x-0">
            <Button
              onClick={handlePrimaryAction}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg shadow-emerald-200 shadow-lg transition-all active:scale-[0.98]"
            >
              {t("primaryBtn")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="w-full text-gray-400 hover:text-gray-600 text-xs font-normal h-auto py-2 hover:bg-transparent"
            >
              {t("secondaryBtn")}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}