"use client";

import { useState, useEffect } from "react";
import HorizontalWaffleReveal from "./HorizontalWaffleReveal";
import VerticalWaffleReveal from "./VerticalWaffleReveal";
import { TRANSITION_CONFIG } from "../config/transitionConfig";

export default function WaffleReveal() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= TRANSITION_CONFIG.DESKTOP_BREAKPOINT);
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  // SSR initial fallback render until client-side hydration mounts
  if (isDesktop === null) {
    return (
      <section id="experience" className="relative w-full min-h-screen bg-[#0E0906]">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center">
          <div className="text-[#D4A85C] text-xs font-mono tracking-widest uppercase animate-pulse">
            Loading Cinematic Experience...
          </div>
        </div>
      </section>
    );
  }

  // Device Separation: Render Desktop Horizontal (>= 768px) vs Mobile Vertical (< 768px)
  return isDesktop ? <HorizontalWaffleReveal /> : <VerticalWaffleReveal />;
}
