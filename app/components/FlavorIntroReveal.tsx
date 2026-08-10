"use client";

import { useState } from "react";
import { MotionValue, useTransform, useMotionValueEvent, useReducedMotion, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FlavorWordConfig {
  number: string;
  word: string;
  enterStart: number;
  enterEnd: number;
  exitStart: number;
  exitEnd: number;
}

const FLAVOR_WORDS: FlavorWordConfig[] = [
  { number: "01", word: "Crispy", enterStart: 0.02, enterEnd: 0.045, exitStart: 0.07, exitEnd: 0.09 },
  { number: "02", word: "Fluffy", enterStart: 0.09, enterEnd: 0.115, exitStart: 0.14, exitEnd: 0.16 },
  { number: "03", word: "Buttery", enterStart: 0.16, enterEnd: 0.185, exitStart: 0.21, exitEnd: 0.23 },
  { number: "04", word: "Sweet", enterStart: 0.23, enterEnd: 0.255, exitStart: 0.28, exitEnd: 0.30 },
  { number: "05", word: "Delicious", enterStart: 0.30, enterEnd: 0.33, exitStart: 0.36, exitEnd: 0.38 },
];

interface FlavorWordItemProps {
  config: FlavorWordConfig;
  progress: MotionValue<number>;
  prefersReducedMotion: boolean | null;
}

function FlavorWordItem({ config, progress, prefersReducedMotion }: FlavorWordItemProps) {
  const { enterStart, enterEnd, exitStart, exitEnd } = config;

  // Ultra-smooth feather opacity transition
  const opacity = useTransform(progress, [enterStart, enterEnd, exitStart, exitEnd], [0, 1, 1, 0]);

  // Subtle luxury vertical drift: enters from +16px below, floats up -16px on exit
  const translateY = useTransform(
    progress,
    [enterStart, enterEnd, exitStart, exitEnd],
    prefersReducedMotion ? [0, 0, 0, 0] : [16, 0, 0, -16]
  );

  // Subtle scale breathing: 0.97 -> 1.0 -> 1.02
  const scale = useTransform(
    progress,
    [enterStart, enterEnd, exitStart, exitEnd],
    prefersReducedMotion ? [1, 1, 1, 1] : [0.97, 1.0, 1.0, 1.02]
  );

  // Soft ambient bloom opacity
  const bloomOpacity = useTransform(progress, [enterStart, enterEnd, exitStart, exitEnd], [0, 0.4, 0.4, 0]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 px-4 select-none">
      {/* Soft Ambient Warm Glow behind the word */}
      <motion.div
        style={{ opacity: bloomOpacity }}
        className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[radial-gradient(circle,rgba(212,168,92,0.18)_0%,transparent_70%)] blur-2xl pointer-events-none"
      />

      <motion.div
        style={{ opacity, y: translateY, scale }}
        className="relative z-10 flex flex-col items-center text-center max-w-xl"
      >
        {/* Subtle Category Badge */}
        <div className="flex items-center gap-2 text-[#D4A85C]/70 text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4A85C]" />
          <span>FLAVOR PROFILE NO. {config.number}</span>
        </div>

        {/* Hairline Top Divider */}
        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#D4A85C]/40 to-transparent mb-4" />

        {/* Elegant Display Title */}
        <h2
          className="font-playfair font-bold text-[#F2EEE6] tracking-[0.15em] uppercase leading-none drop-shadow-[0_0_25px_rgba(212,168,92,0.3)]"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 5.5rem)",
          }}
        >
          <span className="text-gold-gradient">{config.word}</span>
        </h2>

        {/* Hairline Bottom Divider */}
        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#D4A85C]/40 to-transparent mt-4" />
      </motion.div>
    </div>
  );
}

interface FlavorIntroRevealProps {
  progress: MotionValue<number>;
}

export default function FlavorIntroReveal({ progress }: FlavorIntroRevealProps) {
  const [activeWords, setActiveWords] = useState<boolean[]>(new Array(FLAVOR_WORDS.length).fill(false));
  const prefersReducedMotion = useReducedMotion();

  // Bottom idle scroll chevron opacity: 1 at scroll=0, fades out to 0 at scroll=0.02
  const idleChevronOpacity = useTransform(progress, [0, 0.02], [1, 0]);

  // Performance Optimization: Conditionally mount/unmount words only within active window
  useMotionValueEvent(progress, "change", (latest) => {
    const updated = FLAVOR_WORDS.map(
      (w) => latest >= w.enterStart - 0.015 && latest <= w.exitEnd + 0.015
    );

    if (updated.some((val, idx) => val !== activeWords[idx])) {
      setActiveWords(updated);
    }
  });

  return (
    <>
      {/* IDLE Chevron Indicator */}
      <motion.div
        style={{ opacity: idleChevronOpacity }}
        className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-1.5 text-[#D4A85C]/80 pb-[env(safe-area-inset-bottom)]"
      >
        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#D4A85C]/70">
          Scroll to Experience
        </span>
        <ChevronDown className="w-5 h-5 text-[#D4A85C] animate-bounce" />
      </motion.div>

      {/* 5 Elegant Cinematic Flavor Words */}
      {FLAVOR_WORDS.map((config, index) =>
        activeWords[index] ? (
          <FlavorWordItem
            key={config.word}
            config={config}
            progress={progress}
            prefersReducedMotion={prefersReducedMotion}
          />
        ) : null
      )}
    </>
  );
}
