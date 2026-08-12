"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, useMotionValueEvent, useTransform, useReducedMotion, motion, AnimatePresence } from "framer-motion";
import { Star, Sparkles, Heart } from "lucide-react";
import { TRANSITION_CONFIG } from "../config/transitionConfig";

export default function HorizontalWaffleReveal() {
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

  // Scroll tracking across sticky container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Hero overlay transitions (fade in smoothly as video transition approaches completion)
  const initialScrollCueOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const heroTextOpacity = useTransform(scrollYProgress, [0.80, 0.93, 1.00], [0, 1, 1]);
  const heroTextY = useTransform(scrollYProgress, [0.80, 0.93, 1.00], [25, 0, 0]);
  const heroTextScale = useTransform(scrollYProgress, [0.80, 0.93, 1.00], [0.96, 1, 1]);

  // Canvas Frame Renderer
  const renderFrame = useCallback((targetIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let img = bitMapsRef.current[targetIndex];
    if (!img) {
      // Find nearest loaded bitmap fallback
      for (let i = targetIndex; i >= 0; i--) {
        if (bitMapsRef.current[i]) {
          img = bitMapsRef.current[i];
          break;
        }
      }
    }
    if (!img) {
      for (let i = targetIndex; i < TRANSITION_CONFIG.TOTAL_FRAMES_HORIZONTAL; i++) {
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

    // Responsive aspect-ratio preservation (landscape containment)
    const scale = Math.min(displayWidth / imgWidth, displayHeight / imgHeight);
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;
    const drawX = (displayWidth - drawWidth) / 2;
    const drawY = (displayHeight - drawHeight) / 2;

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();

    currentRenderedFrameRef.current = targetIndex;
  }, []);

  // Continuous RAF interpolation engine loop
  const updateFrameLoop = useCallback(() => {
    const target = rawTargetProgressRef.current;
    const current = smoothedProgressRef.current;

    // Damped interpolation calculation
    const smoothing = prefersReducedMotion ? 1 : TRANSITION_CONFIG.SMOOTHING_DESKTOP;
    const delta = target - current;
    const nextProgress = Math.abs(delta) < 0.0001 ? target : current + delta * smoothing;
    smoothedProgressRef.current = nextProgress;

    const targetFrame = Math.min(
      TRANSITION_CONFIG.TOTAL_FRAMES_HORIZONTAL - 1,
      Math.max(0, Math.floor(nextProgress * TRANSITION_CONFIG.TOTAL_FRAMES_HORIZONTAL))
    );

    if (targetFrame !== currentRenderedFrameRef.current) {
      renderFrame(targetFrame);
    }

    // Keep RAF running while settling toward target
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

  // Progressive Preloading Strategy
  useEffect(() => {
    let isMounted = true;
    const loadedBitmaps: (ImageBitmap | HTMLImageElement)[] = new Array(TRANSITION_CONFIG.TOTAL_FRAMES_HORIZONTAL);

    const loadSingleFrame = async (index: number) => {
      const frameNum = (index + 1).toString().padStart(4, "0");
      const src = `${TRANSITION_CONFIG.HORIZONTAL_VIDEO_PATH}${TRANSITION_CONFIG.FRAME_PREFIX}${frameNum}.webp`;

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

      // Critical Batch 1: Load initial 20 frames for instant entrance display
      const initialBatch = [];
      for (let i = 0; i < TRANSITION_CONFIG.INITIAL_CRITICAL_FRAMES; i++) {
        initialBatch.push(loadSingleFrame(i));
      }
      await Promise.all(initialBatch);

      if (isMounted) {
        setIsLoaded(true);
        renderFrame(0);
      }

      // Hard timeout fallback
      const timer = setTimeout(() => {
        if (isMounted) setIsLoaded(true);
      }, 1000);

      // Batch 2: Background preloading of remaining frames
      const remainingIndexes = Array.from(
        { length: TRANSITION_CONFIG.TOTAL_FRAMES_HORIZONTAL - TRANSITION_CONFIG.INITIAL_CRITICAL_FRAMES },
        (_, i) => i + TRANSITION_CONFIG.INITIAL_CRITICAL_FRAMES
      );
      const CHUNK_SIZE = 20;

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

  // Update raw target scroll progress
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgress(latest);
    if (!isLoaded) return;

    // Normalize progress across transition scrub range (0.00 -> 0.85)
    const animationProgress = Math.max(0, Math.min(1, latest / TRANSITION_CONFIG.ANIMATION_END_PROGRESS));
    rawTargetProgressRef.current = animationProgress;

    scheduleFrameUpdate();
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (isLoaded && currentRenderedFrameRef.current >= 0) {
        renderFrame(currentRenderedFrameRef.current);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isLoaded, renderFrame]);

  return (
    <section
      id="experience-desktop"
      ref={containerRef}
      style={{ height: `${TRANSITION_CONFIG.SCROLL_DISTANCE_DESKTOP}vh` }}
      className="relative w-full bg-[#0E0906]"
    >
      {/* Luxury Preloader Curtain */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)", transition: { duration: 0.7, ease: "easeOut" } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0E0906] px-6 select-none"
          >
            <div className="absolute w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(212,168,92,0.25)_0%,transparent_70%)] blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="flex items-center gap-3 text-[#D4A85C] text-xs uppercase tracking-[0.3em] mb-4">
                <span className="w-8 h-[1px] bg-[#D4A85C]" />
                <span>DESKTOP EXPERIENCE</span>
                <span className="w-8 h-[1px] bg-[#D4A85C]" />
              </div>
              <h1 className="font-playfair text-6xl md:text-8xl font-extrabold text-[#D4A85C] tracking-tight drop-shadow-[0_0_35px_rgba(212,168,92,0.6)] mb-3">
                HI WAFFLES
              </h1>
              <p className="font-dmsans text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-[#F2EEE6]/80">
                SCROLL TO ASSEMBLY
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden hero-canvas-bg flex items-center justify-center">
        {/* Radial Background Bloom */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(51,37,28,0.25)_0%,rgba(23,23,22,0.65)_60%,rgba(14,9,6,0.95)_100%)]" />

        {/* Persistent Canvas Element for Horizontal Video Frame Scrubbing */}
        <div className="relative w-full h-full flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="relative z-10 w-full h-full object-contain pointer-events-none"
          />
        </div>

        {/* Dynamic Image Darkening & Edge Vignettes at Final Frame */}
        <motion.div
          style={{ opacity: heroTextOpacity }}
          className="absolute inset-0 pointer-events-none z-13 bg-[#0E0906]/40 transition-opacity duration-700"
        />
        <motion.div
          style={{ opacity: heroTextOpacity }}
          className="absolute inset-0 pointer-events-none z-14 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(14,9,6,0.65)_60%,rgba(14,9,6,0.98)_95%)] transition-opacity duration-700"
        />
        <motion.div
          style={{ opacity: heroTextOpacity }}
          className="absolute inset-0 pointer-events-none z-15 bg-gradient-to-r from-[#0E0906] via-[#0E0906]/85 45% to-transparent transition-opacity duration-700"
        />
        <motion.div
          style={{ opacity: heroTextOpacity }}
          className="absolute inset-0 pointer-events-none z-15 bg-gradient-to-b from-[#0E0906]/85 via-transparent to-[#0E0906]/95 transition-opacity duration-700"
        />

        {/* Initial Scroll Cue */}
        <motion.div
          style={{ opacity: initialScrollCueOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-1.5 text-[#D4A85C]/80"
        >
          <span className="text-xs font-mono uppercase tracking-[0.25em]">Scroll down to reveal</span>
          <div className="w-5 h-5 text-[#D4A85C] animate-bounce">↓</div>
        </motion.div>

        {/* Bottom Center Tagline below Waffle Plate */}
        <motion.div
          style={{ opacity: heroTextOpacity }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-4 text-center whitespace-nowrap"
        >
          <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#D4A85C]" />
          <span className="text-xs sm:text-sm font-dmsans font-bold uppercase tracking-[0.3em] text-[#D4A85C] drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            TASTE THE REAL FLAVOUR OF WAFFLES
          </span>
          <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#D4A85C]" />
        </motion.div>

        {/* HERO CONTENT OVERLAY */}
        <motion.div
          style={{
            opacity: heroTextOpacity,
            y: heroTextY,
            scale: heroTextScale,
            pointerEvents: scrollProgress >= 0.80 ? "auto" : "none",
          }}
          className="absolute inset-0 z-20 flex flex-col justify-center items-start pt-16 px-8 sm:px-14 md:px-20 lg:px-28 max-w-7xl mx-auto pointer-events-none"
        >
          <div className="max-w-md sm:max-w-lg lg:max-w-xl flex flex-col items-start pointer-events-auto">
            <div className="flex items-center gap-3 text-[#D4A85C] text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] mb-4">
              <span className="w-8 h-[1px] bg-[#D4A85C]" />
              <span>INDULGE IN PERFECTION</span>
              <span className="w-8 h-[1px] bg-[#D4A85C]" />
            </div>

            <h1 className="font-playfair text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-[#F2EEE6] leading-[0.95] mb-5 drop-shadow-2xl">
              Chocolate <br />
              <span className="font-script text-[#D4A85C] text-6xl sm:text-8xl md:text-9xl font-normal capitalize tracking-normal leading-[0.85] drop-shadow-[0_0_35px_rgba(212,168,92,0.6)] block mt-1">
                Waffle
              </span>
            </h1>

            <p className="font-dmsans text-sm sm:text-base text-[#F2EEE6]/90 max-w-md font-normal leading-relaxed mb-8 drop-shadow-md">
              Crispy, warm & drizzled with rich chocolate. <br />
              A dessert that feels like a celebration.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="#menu"
                className="px-7 py-3.5 rounded bg-[#D4A85C] text-[#0E0906] font-bold text-xs uppercase tracking-[0.15em] hover:bg-[#B98A3F] transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(212,168,92,0.4)]"
              >
                VIEW MENU
              </a>
              <a
                href="#contact"
                className="px-7 py-3.5 rounded border border-[#D4A85C] text-[#D4A85C] font-bold text-xs uppercase tracking-[0.15em] hover:bg-[#D4A85C]/15 transition-all duration-300 backdrop-blur-md"
              >
                BULK ORDERS
              </a>
            </div>
          </div>

          <div className="absolute bottom-8 left-8 sm:left-14 md:left-20 lg:left-28 z-20 hidden sm:flex items-center gap-6 divide-x divide-[#D4A85C]/30 text-left">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-[#D4A85C] flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F2EEE6]/90 leading-tight">PREMIUM</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F2EEE6]/90 leading-tight">QUALITY</span>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-6">
              <Sparkles className="w-5 h-5 text-[#D4A85C] flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F2EEE6]/90 leading-tight">FRESH</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F2EEE6]/90 leading-tight">INGREDIENTS</span>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-6">
              <Heart className="w-5 h-5 text-[#D4A85C] flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F2EEE6]/90 leading-tight">MADE WITH</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F2EEE6]/90 leading-tight">LOVE</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
