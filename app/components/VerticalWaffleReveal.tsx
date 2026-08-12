"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, useMotionValueEvent, useTransform, useReducedMotion, motion, AnimatePresence } from "framer-motion";
import { Star, Sparkles, Heart } from "lucide-react";
import { TRANSITION_CONFIG } from "../config/transitionConfig";

export default function VerticalWaffleReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const bitMapsRef = useRef<(ImageBitmap | HTMLImageElement)[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const rawTargetProgressRef = useRef<number>(0);
  const smoothedProgressRef = useRef<number>(0);
  const currentRenderedFrameRef = useRef<number>(-1);
  const prefersReducedMotion = useReducedMotion();

  // Passive touch scroll tracking across sticky container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Mobile overlay transitions
  const initialScrollCueOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const heroTextOpacity = useTransform(scrollYProgress, [0.78, 0.92, 1.00], [0, 1, 1]);
  const heroTextY = useTransform(scrollYProgress, [0.78, 0.92, 1.00], [20, 0, 0]);
  const heroTextScale = useTransform(scrollYProgress, [0.78, 0.92, 1.00], [0.95, 1, 1]);

  // High-DPI Canvas Frame Renderer (Mobile Portrait containment)
  const renderFrame = useCallback((targetIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let img = bitMapsRef.current[targetIndex];
    if (!img) {
      for (let i = targetIndex; i >= 0; i--) {
        if (bitMapsRef.current[i]) {
          img = bitMapsRef.current[i];
          break;
        }
      }
    }
    if (!img) {
      for (let i = targetIndex; i < TRANSITION_CONFIG.TOTAL_FRAMES_VERTICAL; i++) {
        if (bitMapsRef.current[i]) {
          img = bitMapsRef.current[i];
          break;
        }
      }
    }
    if (!img) return;

    const imgWidth = img.width;
    const imgHeight = img.height;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (displayWidth === 0 || displayHeight === 0) return;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.clearRect(0, 0, displayWidth, displayHeight);

    // Responsive aspect-ratio preservation (portrait containment)
    const scale = Math.min(displayWidth / imgWidth, displayHeight / imgHeight);
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;
    const drawX = (displayWidth - drawWidth) / 2;
    const drawY = (displayHeight - drawHeight) / 2;

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();

    currentRenderedFrameRef.current = targetIndex;
  }, []);

  // RAF interpolation engine loop (Tuned for Touch Momentum)
  const updateFrameLoop = useCallback(() => {
    const target = rawTargetProgressRef.current;
    const current = smoothedProgressRef.current;

    const smoothing = prefersReducedMotion ? 1 : TRANSITION_CONFIG.SMOOTHING_MOBILE;
    const delta = target - current;
    const nextProgress = Math.abs(delta) < 0.0001 ? target : current + delta * smoothing;
    smoothedProgressRef.current = nextProgress;

    const targetFrame = Math.min(
      TRANSITION_CONFIG.TOTAL_FRAMES_VERTICAL - 1,
      Math.max(0, Math.floor(nextProgress * TRANSITION_CONFIG.TOTAL_FRAMES_VERTICAL))
    );

    if (targetFrame !== currentRenderedFrameRef.current) {
      renderFrame(targetFrame);
    }

    if (Math.abs(target - smoothedProgressRef.current) > 0.0001) {
      animationFrameRef.current = requestAnimationFrame(updateFrameLoop);
    } else {
      animationFrameRef.current = null;
    }
  }, [renderFrame, prefersReducedMotion]);

  const scheduleFrameUpdate = useCallback(() => {
    if (animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(updateFrameLoop);
    }
  }, [updateFrameLoop]);

  // Mobile Preloading Strategy
  useEffect(() => {
    let isMounted = true;
    const loadedBitmaps: (ImageBitmap | HTMLImageElement)[] = new Array(TRANSITION_CONFIG.TOTAL_FRAMES_VERTICAL);

    const loadSingleFrame = async (index: number) => {
      const frameNum = (index + 1).toString().padStart(4, "0");
      const src = `${TRANSITION_CONFIG.VERTICAL_VIDEO_PATH}${TRANSITION_CONFIG.FRAME_PREFIX}${frameNum}.webp`;

      try {
        const response = await fetch(src);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();
        const bitmap = await createImageBitmap(blob);
        if (isMounted) loadedBitmaps[index] = bitmap;
      } catch {
        try {
          const img = new Image();
          img.src = src;
          await new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
          if (isMounted) loadedBitmaps[index] = img;
        } catch {
          // ignore
        }
      }
    };

    const startProgressiveLoad = async () => {
      bitMapsRef.current = loadedBitmaps;

      // Critical Batch 1: First 20 frames
      const initialBatch = [];
      for (let i = 0; i < TRANSITION_CONFIG.INITIAL_CRITICAL_FRAMES; i++) {
        initialBatch.push(loadSingleFrame(i));
      }
      await Promise.all(initialBatch);

      if (isMounted) {
        setIsLoaded(true);
        renderFrame(0);
      }

      const timer = setTimeout(() => {
        if (isMounted) setIsLoaded(true);
      }, 1000);

      // Batch 2: Remaining frames
      const remainingIndexes = Array.from(
        { length: TRANSITION_CONFIG.TOTAL_FRAMES_VERTICAL - TRANSITION_CONFIG.INITIAL_CRITICAL_FRAMES },
        (_, i) => i + TRANSITION_CONFIG.INITIAL_CRITICAL_FRAMES
      );
      const CHUNK_SIZE = 15;

      for (let i = 0; i < remainingIndexes.length; i += CHUNK_SIZE) {
        if (!isMounted) break;
        const chunk = remainingIndexes.slice(i, i + CHUNK_SIZE);
        await Promise.all(chunk.map((idx) => loadSingleFrame(idx)));
      }

      clearTimeout(timer);
    };

    startProgressiveLoad();

    return () => {
      isMounted = false;
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      bitMapsRef.current.forEach((bm) => {
        if (bm && "close" in bm && typeof bm.close === "function") {
          bm.close();
        }
      });
    };
  }, [renderFrame]);

  // Update target progress on touch scroll
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgress(latest);
    if (!isLoaded) return;

    const animationProgress = Math.max(0, Math.min(1, latest / TRANSITION_CONFIG.ANIMATION_END_PROGRESS));
    rawTargetProgressRef.current = animationProgress;

    scheduleFrameUpdate();
  });

  // Mobile Viewport Resize / Orientation / Address Bar handling
  useEffect(() => {
    const handleResize = () => {
      if (isLoaded && currentRenderedFrameRef.current >= 0) {
        renderFrame(currentRenderedFrameRef.current);
      }
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [isLoaded, renderFrame]);

  return (
    <section
      id="experience-mobile"
      ref={containerRef}
      style={{ height: `${TRANSITION_CONFIG.SCROLL_DISTANCE_MOBILE}vh` }}
      className="relative w-full bg-[#0E0906]"
    >
      {/* Mobile Preloader Curtain */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(6px)", transition: { duration: 0.6, ease: "easeOut" } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0E0906] px-6 select-none"
          >
            <div className="absolute w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(212,168,92,0.3)_0%,transparent_70%)] blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="flex items-center gap-2 text-[#D4A85C] text-[11px] font-semibold uppercase tracking-[0.25em] mb-3">
                <span className="w-6 h-[1px] bg-[#D4A85C]" />
                <span>MOBILE EXPERIENCE</span>
                <span className="w-6 h-[1px] bg-[#D4A85C]" />
              </div>
              <h1 className="font-playfair text-5xl font-extrabold text-[#D4A85C] tracking-tight drop-shadow-[0_0_25px_rgba(212,168,92,0.6)] mb-3">
                HI WAFFLES
              </h1>
              <p className="font-dmsans text-[11px] font-bold uppercase tracking-[0.2em] text-[#F2EEE6]/80">
                SWIPE TO ASSEMBLE
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Fullscreen Sticky Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden hero-canvas-bg flex items-center justify-center pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        {/* Ambient Warm Radial Background */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(51,37,28,0.3)_0%,rgba(14,9,6,0.98)_85%)]" />

        {/* Canvas Element rendering Vertical Mobile Video Sequence */}
        <div className="relative w-full h-full flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="relative z-10 w-full h-full object-contain pointer-events-none"
          />
        </div>

        {/* Dynamic Image Darkening & Edge Corners Vignette at Final Frame */}
        <motion.div
          style={{ opacity: heroTextOpacity }}
          className="absolute inset-0 pointer-events-none z-13 bg-[#0E0906]/45 transition-opacity duration-500"
        />
        <motion.div
          style={{ opacity: heroTextOpacity }}
          className="absolute inset-0 pointer-events-none z-14 bg-[radial-gradient(ellipse_at_50%_65%,transparent_20%,rgba(14,9,6,0.70)_55%,rgba(14,9,6,0.98)_90%)] transition-opacity duration-500"
        />
        <motion.div
          style={{ opacity: heroTextOpacity }}
          className="absolute inset-0 pointer-events-none z-15 bg-gradient-to-b from-[#0E0906]/95 via-[#0E0906]/75 45% to-transparent transition-opacity duration-500"
        />
        <motion.div
          style={{ opacity: heroTextOpacity }}
          className="absolute inset-0 pointer-events-none z-15 bg-gradient-to-t from-[#0E0906]/90 via-transparent to-transparent top-auto h-1/4 transition-opacity duration-500"
        />

        {/* Initial Touch Swipe Cue */}
        <motion.div
          style={{ opacity: initialScrollCueOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-1 text-[#D4A85C]"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Swipe down to assemble</span>
          <div className="w-4 h-4 animate-bounce">↓</div>
        </motion.div>

        {/* Bottom Tagline below Waffle Plate */}
        <motion.div
          style={{ opacity: heroTextOpacity }}
          className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-3 text-center whitespace-nowrap"
        >
          <span className="w-6 sm:w-10 h-[1px] bg-gradient-to-r from-transparent to-[#D4A85C]" />
          <span className="text-[10px] sm:text-xs font-dmsans font-bold uppercase tracking-[0.22em] text-[#D4A85C] drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            TASTE THE REAL FLAVOUR OF WAFFLES
          </span>
          <span className="w-6 sm:w-10 h-[1px] bg-gradient-to-l from-transparent to-[#D4A85C]" />
        </motion.div>

        {/* MOBILE HERO OVERLAY - TOP LEFT (SLIGHTLY LOWER) POSITION */}
        <motion.div
          style={{
            opacity: heroTextOpacity,
            y: heroTextY,
            scale: heroTextScale,
            pointerEvents: scrollProgress >= 0.78 ? "auto" : "none",
          }}
          className="absolute inset-0 z-20 flex flex-col justify-start items-start px-6 sm:px-10 max-w-xs sm:max-w-sm pointer-events-none pt-28 sm:pt-32"
        >
          <div className="flex flex-col items-start text-left pointer-events-auto">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 text-[#D4A85C] text-[10px] font-semibold uppercase tracking-[0.2em] mb-2">
              <span className="w-5 h-[1px] bg-[#D4A85C]" />
              <span>INDULGE IN PERFECTION</span>
            </div>

            {/* Title */}
            <h1 className="font-playfair text-4xl sm:text-5xl font-bold tracking-tight text-[#F2EEE6] leading-[0.95] mb-2 drop-shadow-2xl text-left">
              Chocolate <br />
              <span className="font-script text-[#D4A85C] text-5xl sm:text-6xl font-normal capitalize leading-[0.85] drop-shadow-[0_0_25px_rgba(212,168,92,0.6)] block mt-1">
                Waffle
              </span>
            </h1>

            {/* Description */}
            <p className="font-dmsans text-xs text-[#F2EEE6]/90 font-normal leading-relaxed mb-5 drop-shadow-md text-left max-w-[250px]">
              Crispy, warm & drizzled with rich chocolate. <br />
              A dessert that feels like a celebration.
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-2.5 w-full">
              <a
                href="#menu"
                className="px-4 py-2.5 rounded bg-[#D4A85C] text-[#0E0906] font-bold text-[11px] uppercase tracking-[0.12em] hover:bg-[#B98A3F] transition-all shadow-lg text-center active:scale-95"
              >
                VIEW MENU
              </a>
              <a
                href="#contact"
                className="px-4 py-2.5 rounded border border-[#D4A85C] text-[#D4A85C] font-bold text-[11px] uppercase tracking-[0.12em] hover:bg-[#D4A85C]/15 transition-all backdrop-blur-md text-center active:scale-95"
              >
                BULK ORDERS
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
