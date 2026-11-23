"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import BackToHome from "@/components/BackToHome";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import RevealObserver from "@/components/providers/RevealObserver";

/**
 * Wraps every public page with the site chrome. The Sanity Studio is served
 * from the same app but must not inherit the marketing nav, footer or motion.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio") ?? false;
  const isHome = pathname === "/" || pathname === null;
  const [pastFold, setPastFold] = useState(false);

  useEffect(() => {
    if (isHome) return;

    // A 1px sentinel at the fold replaces a scroll handler that read
    // `window.scrollY` on every frame. IntersectionObserver keeps that work
    // off the main thread and avoids forced reflows.
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText =
      "position:absolute;top:140px;left:0;width:1px;height:1px;pointer-events:none;opacity:0;";
    document.body.appendChild(sentinel);

    const observer = new IntersectionObserver(
      ([entry]) => setPastFold(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, [isHome, pathname]);

  if (isStudio) {
    return (
      <main id="main" className="min-h-svh bg-paper">
        {children}
      </main>
    );
  }

  return (
    <>
      <RevealObserver />

      <SiteNav />
      <main id="main">{children}</main>
      <SiteFooter />
      <FloatingWhatsApp />
      {/* Only on inner pages, and only once the header copy has scrolled away,
          so it never sits on top of a hero headline or intro. */}
      <AnimatePresence>
        {!isHome && pastFold && (
          <motion.div
            className="fixed bottom-5 left-5 z-40 md:bottom-8 md:left-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <BackToHome className="rounded-full bg-paper/90 px-4 py-4 text-[10px] leading-none shadow-[0_10px_40px_rgba(118,0,20,0.18)] backdrop-blur transition-transform hover:-translate-y-0.5" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
