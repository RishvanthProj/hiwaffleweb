"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, useMotionValueEvent, useTransform, useReducedMotion, motion, AnimatePresence } from "framer-motion";
import { Star, Sparkles, Heart } from "lucide-react";

const FRAME_PATH = "/sequence/waffle-reveal/";
const FRAME_PREFIX = "frame_";

// End animation sequence precisely at frame 270 (Image 1, final assembled plate)
const TOTAL_FRAMES = 270;
const REVERSE_SEQUENCE = false;

// Geometric scroll track height tuning constant (500vh for snappy, active scrollytelling)
const SCROLL_TRACK_VH = 500;

export default function WaffleReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const bitMapsRef = useRef<(ImageBitmap | HTMLImageElement)[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const currentFrameRef = useRef<number>(0);
  const prefersReducedMotion = useReducedMotion();

  // Raw 1:1 scroll tracking across the sticky section (zero lag, instant response)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Initial scroll indicator (fades out as scroll starts 0 -> 0.05)
  const initialScrollCueOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  // Main Hero Brand Content reveals ONLY AFTER the scroll animation fully completes (0.82 -> 0.95 -> 1.00)
  const heroTextOpacity = useTransform(scrollYProgress, [0.82, 0.95, 1.00], [0, 1, 1]);
  const heroTextY = useTransform(scrollYProgress, [0.82, 0.95, 1.00], [20, 0, 0]);
  const heroTextScale = useTransform(scrollYProgress, [0.82, 0.95, 1.00], [0.97, 1, 1]);

  // Preload and decode 270 WebP frames up to frame_0270.webp
  useEffect(() => {
    let isMounted = true;
    const loadedBitmaps: (ImageBitmap | HTMLImageElement)[] = new Array(TOTAL_FRAMES);
    let completed = 0;

    const loadFrame = async (index: number) => {
      const frameNum = (index + 1).toString().padStart(4, "0");
      const src = `${FRAME_PATH}${FRAME_PREFIX}${frameNum}.webp`;

      try {
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status} fetching ${src}`);
        }
        const blob = await response.blob();
        const bitmap = await createImageBitmap(blob);
        if (isMounted) {
          loadedBitmaps[index] = bitmap;
          completed++;
          setLoadedCount(completed);
        }
      } catch (err) {
        try {
          const img = new Image();
          img.src = src;
          await new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
          if (isMounted) {
            loadedBitmaps[index] = img;
            completed++;
            setLoadedCount(completed);
          }
        } catch (fallbackErr) {
          console.warn(`[WaffleReveal] Frame ${index + 1} failed to load:`, fallbackErr);
          if (isMounted) {
            completed++;
            setLoadedCount(completed);
          }
        }
      }
    };

    const loadAll = async () => {
      const promises = [];
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        promises.push(loadFrame(i));
      }
      await Promise.all(promises);

      if (isMounted) {
        bitMapsRef.current = loadedBitmaps;
        setIsLoaded(true);

        const decodedCount = loadedBitmaps.filter((bm) => bm !== undefined).length;
        console.log(
          `[WaffleReveal] Preload Complete: ${decodedCount} / ${TOTAL_FRAMES} frames successfully decoded.`
        );
      }
    };

    loadAll();

    return () => {
      isMounted = false;
      bitMapsRef.current.forEach((bm) => {
        if (bm && "close" in bm && typeof bm.close === "function") {
          bm.close();
        }
      });
    };
  }, []);

  // Canvas draw logic
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = bitMapsRef.current[frameIndex];
    if (!img) return;

    const imgWidth = img.width;
    const imgHeight = img.height;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.clearRect(0, 0, displayWidth, displayHeight);

    const scale = Math.min(displayWidth / imgWidth, displayHeight / imgHeight);
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;
    const drawX = (displayWidth - drawWidth) / 2;
    const drawY = (displayHeight - drawHeight) / 2;

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();
  }, []);

  const requestFrameDraw = useCallback(
    (targetIndex: number) => {
      currentFrameRef.current = targetIndex;
      if (animationFrameRef.current !== null) return;

      animationFrameRef.current = requestAnimationFrame(() => {
        renderFrame(currentFrameRef.current);
        animationFrameRef.current = null;
      });
    },
    [renderFrame]
  );

  // Map raw scrollYProgress (0.00 -> 0.82) linearly to frame index (0 -> 269 = frame_0270.webp)
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgress(latest);
    if (!isLoaded || prefersReducedMotion) return;

    const animationProgress = Math.max(0, Math.min(1, latest / 0.82));
    let progress = animationProgress;
    if (REVERSE_SEQUENCE) progress = 1 - progress;

    const targetFrame = Math.min(
      TOTAL_FRAMES - 1,
      Math.floor(progress * TOTAL_FRAMES)
    );

    requestFrameDraw(targetFrame);
  });

  useEffect(() => {
    if (isLoaded) {
      const currentScroll = scrollYProgress.get();
      setScrollProgress(currentScroll);
      const animationProgress = Math.max(0, Math.min(1, currentScroll / 0.82));
      let progress = animationProgress;
      if (REVERSE_SEQUENCE) progress = 1 - progress;
      const targetFrame = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(progress * TOTAL_FRAMES)
      );
      requestFrameDraw(targetFrame);
    }
  }, [isLoaded, scrollYProgress, requestFrameDraw]);

  useEffect(() => {
    const handleResize = () => {
      if (isLoaded) {
        renderFrame(currentFrameRef.current);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isLoaded, renderFrame]);

  return (
    <section
      id="experience"
      ref={containerRef}
      style={{ height: `${SCROLL_TRACK_VH}vh` }}
      className="relative w-full bg-[#0E0906]"
    >
      {/* Luxury Intro Splash Curtain - Fades out on load with Zoom Exit */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 1.15,
              filter: "blur(6px)",
              transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
            }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0E0906] hero-canvas-bg px-6 select-none"
          >
            {/* Ambient Gold Bloom behind Intro Text */}
            <div className="absolute w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(212,168,92,0.2)_0%,transparent_70%)] blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center max-w-xl">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 text-[#D4A85C] text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] mb-4">
                <span className="w-8 h-[1px] bg-[#D4A85C]" />
                <span>WELCOME TO</span>
                <span className="w-8 h-[1px] bg-[#D4A85C]" />
              </div>

              {/* Main Brand Title */}
              <h1 className="font-playfair text-5xl sm:text-7xl md:text-8xl font-extrabold text-[#D4A85C] tracking-tight leading-none drop-shadow-[0_0_35px_rgba(212,168,92,0.65)] mb-5">
                HI WAFFLES
              </h1>

              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D4A85C] to-transparent mb-5" />

              {/* Subhead Tagline */}
              <p className="font-dmsans text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.25em] text-[#F2EEE6]/90 mb-6">
                EXPERIENCE THE REAL TASTE
              </p>

              {/* Subtle Loading Progress Text */}
              <div className="text-[10px] font-mono text-[#D4A85C]/70 tracking-widest uppercase">
                LOADING EXPERIENCE... ({Math.round((loadedCount / TOTAL_FRAMES) * 100)}%)
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Fullscreen Canvas Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden hero-canvas-bg flex items-center">
        {/* Subtle Radial Warm Glow Bloom */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(51,37,28,0.25)_0%,rgba(23,23,22,0.65)_60%,rgba(14,9,6,0.95)_100%)]" />

        {/* Canvas Animation Background with Entrance Zoom Transition */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: isLoaded ? 1 : 1.1, opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-full flex items-center justify-center pointer-events-none"
        >
          <canvas
            ref={canvasRef}
            className="relative z-10 w-full h-full object-contain pointer-events-none"
          />
        </motion.div>

        {/* Dynamic Dark Vignette Overlay */}
        <motion.div
          style={{ opacity: heroTextOpacity }}
          className="absolute inset-0 pointer-events-none z-15 bg-gradient-to-r from-[#0E0906]/85 via-[#0E0906]/55 to-transparent transition-opacity duration-700"
        />
        <motion.div
          style={{ opacity: heroTextOpacity }}
          className="absolute inset-0 pointer-events-none z-15 bg-gradient-to-b from-[#0E0906]/90 via-transparent to-[#0E0906]/90 transition-opacity duration-700"
        />

        {/* Initial Scroll Cue */}
        <motion.div
          style={{ opacity: initialScrollCueOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-1.5 text-[#D4A85C]/80"
        >
          <span className="text-xs font-mono uppercase tracking-[0.25em]">Scroll to Assembly</span>
          <div className="w-5 h-5 text-[#D4A85C] animate-bounce">↓</div>
        </motion.div>

        {/* HERO CONTENT OVERLAY */}
        <motion.div
          style={{
            opacity: heroTextOpacity,
            y: heroTextY,
            scale: heroTextScale,
            pointerEvents: scrollProgress >= 0.82 ? "auto" : "none",
          }}
          className="absolute inset-0 z-20 flex flex-col justify-start items-start pt-24 sm:pt-28 md:pt-32 lg:pt-36 px-8 sm:px-14 md:px-20 lg:px-28 max-w-7xl mx-auto pointer-events-none"
        >
          <div className="max-w-md sm:max-w-lg lg:max-w-xl flex flex-col items-start pointer-events-auto">
            {/* Eyebrow Tagline with Gold Hairlines */}
            <div className="flex items-center gap-3 text-[#D4A85C] text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] mb-4">
              <span className="w-8 h-[1px] bg-[#D4A85C]" />
              <span>INDULGE IN PERFECTION</span>
              <span className="w-8 h-[1px] bg-[#D4A85C]" />
            </div>

            {/* Main Title: Chocolate (Serif) + Waffle (Gold Cursive Script) */}
            <h1 className="font-playfair text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-[#F2EEE6] leading-[0.95] mb-5 drop-shadow-2xl">
              Chocolate <br />
              <span className="font-script text-[#D4A85C] text-6xl sm:text-8xl md:text-9xl font-normal capitalize tracking-normal leading-[0.85] drop-shadow-[0_0_35px_rgba(212,168,92,0.6)] block mt-1">
                Waffle
              </span>
            </h1>

            {/* Subhead Body Text */}
            <p className="font-dmsans text-sm sm:text-base text-[#F2EEE6]/90 max-w-md font-normal leading-relaxed mb-8 drop-shadow-md">
              Crispy, warm & drizzled with rich chocolate. <br />
              A dessert that feels like a celebration.
            </p>

            {/* CTA Buttons */}
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

          {/* Bottom-Left Feature Strip */}
          <div className="absolute bottom-8 left-8 sm:left-14 md:left-20 lg:left-28 z-20 hidden sm:flex items-center gap-6 divide-x divide-[#D4A85C]/30 text-left">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-[#D4A85C] flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F2EEE6]/90 leading-tight">
                  PREMIUM
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F2EEE6]/90 leading-tight">
                  QUALITY
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pl-6">
              <Sparkles className="w-5 h-5 text-[#D4A85C] flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F2EEE6]/90 leading-tight">
                  FRESH
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F2EEE6]/90 leading-tight">
                  INGREDIENTS
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pl-6">
              <Heart className="w-5 h-5 text-[#D4A85C] flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F2EEE6]/90 leading-tight">
                  MADE WITH
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F2EEE6]/90 leading-tight">
                  LOVE
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Simplified Live Readout (1 progress source: scroll: 0.xxx | frame: N) */}
        {process.env.NODE_ENV === "development" && (
          <div className="fixed bottom-3 right-3 z-50 px-3 py-1 rounded bg-[#0E0906]/90 border border-[#D4A85C]/40 text-[11px] font-mono text-[#D4A85C] pointer-events-none select-none shadow-md">
            scroll: {scrollProgress.toFixed(3)} | frame: {currentFrameRef.current + 1}
          </div>
        )}
      </div>
    </section>
  );
}
