"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function ArtOfToppings() {
  return (
    <section className="relative py-28 px-6 sm:px-12 md:px-16 lg:px-24 bg-[#0E0906] overflow-hidden">
      {/* Dark Ambient Radial Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_50%,rgba(51,37,28,0.25)_0%,transparent_70%)]" />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Copy matching reference screenshot 2 */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-6 flex flex-col items-start order-2 lg:order-1"
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3 text-[#D4A85C] text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] mb-4">
            <span className="w-8 h-[1px] bg-[#D4A85C]" />
            <span>THE ART OF TOPPINGS</span>
          </div>

          {/* Headline */}
          <h2 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F2EEE6] leading-[1.1] mb-6">
            Every Layer, <br />
            <span className="font-script text-[#D4A85C] text-5xl sm:text-6xl lg:text-7xl font-normal capitalize tracking-normal leading-[0.9] drop-shadow-[0_0_25px_rgba(212,168,92,0.4)]">
              Perfectly Balanced
            </span>
          </h2>

          <div className="w-12 h-[1px] bg-[#D4A85C]/40 mb-6" />

          {/* Paragraph */}
          <p className="font-dmsans text-sm sm:text-base text-[#F2EEE6]/85 leading-relaxed mb-8">
            Our signature bowl is a canvas of contrast — a deep, velvety chocolate base swirled with white drizzle,
            studded with crisp wafer rolls, silky white chocolate pearls, and bursts of colour from our house-blend sprinkle
            mix. On the side sit five curated toppings, each chosen to complement, not compete. It’s restraint and
            indulgence in perfect harmony.
          </p>

          {/* Bullet Highlights */}
          <ul className="space-y-4 mb-10 text-xs sm:text-sm text-[#F2EEE6]/90">
            <li className="flex items-start gap-3">
              <span className="text-[#D4A85C] text-base leading-none">•</span>
              <span>
                <strong className="text-[#F2EEE6] font-semibold">Dark Chocolate Base</strong> — Single-origin cocoa,
                slow-melted and poured warm for maximum depth of flavour.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#D4A85C] text-base leading-none">•</span>
              <span>
                <strong className="text-[#F2EEE6] font-semibold">Curated Toppings Bar</strong> — Five artisan garnishes,
                from house-roasted pearls to hand-crushed biscuit crumble.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#D4A85C] text-base leading-none">•</span>
              <span>
                <strong className="text-[#F2EEE6] font-semibold">Fully Customisable</strong> — Build your bowl your way.
                Every combination is a new experience.
              </span>
            </li>
          </ul>

          {/* Bottom Stats Strip */}
          <div className="w-full pt-6 border-t border-[#D4A85C]/20 grid grid-cols-3 gap-4 text-left">
            <div>
              <div className="font-playfair text-2xl sm:text-3xl font-bold text-[#D4A85C]">8+</div>
              <div className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#F2EEE6]/70 mt-1">
                BOWL VARIETIES
              </div>
            </div>
            <div>
              <div className="font-playfair text-2xl sm:text-3xl font-bold text-[#D4A85C]">20+</div>
              <div className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#F2EEE6]/70 mt-1">
                TOPPING CHOICES
              </div>
            </div>
            <div>
              <div className="font-playfair text-2xl sm:text-3xl font-bold text-[#D4A85C]">∞</div>
              <div className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#F2EEE6]/70 mt-1">
                COMBINATIONS
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Image with Gold Accent Frame */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="lg:col-span-6 relative order-1 lg:order-2"
        >
          <div className="relative rounded-2xl overflow-hidden border border-[#D4A85C]/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] group">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/section3_topping_bowl.png"
                alt="HI Waffles Art of Toppings"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0906]/60 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Thin Decorative Gold Hairline Accent Offset */}
          <div className="absolute -inset-2 border border-[#D4A85C]/15 rounded-3xl -z-10 pointer-events-none hidden sm:block" />
        </motion.div>
      </div>
    </section>
  );
}
