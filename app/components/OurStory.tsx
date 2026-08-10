"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function OurStory() {
  return (
    <section className="relative py-28 px-6 sm:px-12 md:px-16 lg:px-24 bg-[#0E0906] overflow-hidden">
      {/* Background Ambient Radial Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(51,37,28,0.35)_0%,rgba(14,9,6,0.95)_100%)]" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative p-8 sm:p-14 md:p-20 rounded-3xl border border-[#D4A85C]/40 bg-gradient-to-b from-[#1C1714]/90 via-[#0E0906]/95 to-[#1C1714]/90 backdrop-blur-xl shadow-[0_0_60px_rgba(0,0,0,0.9)] text-center"
        >
          {/* Ornate Gold Corner Filigrees */}
          <div className="absolute top-4 left-4 text-[#D4A85C]/70 text-sm">✦</div>
          <div className="absolute top-4 right-4 text-[#D4A85C]/70 text-sm">✦</div>
          <div className="absolute bottom-4 left-4 text-[#D4A85C]/70 text-sm">✦</div>
          <div className="absolute bottom-4 right-4 text-[#D4A85C]/70 text-sm">✦</div>

          {/* Top Heart Filigree Divider */}
          <div className="flex items-center justify-center gap-3 text-[#D4A85C] mb-6">
            <span className="w-12 h-[1px] bg-[#D4A85C]/40" />
            <Heart className="w-4 h-4 fill-[#D4A85C]" />
            <span className="w-12 h-[1px] bg-[#D4A85C]/40" />
          </div>

          {/* Eyebrow */}
          <div className="text-[#D4A85C] text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] mb-4">
            OUR STORY
          </div>

          {/* Main Title: Born from a Love of Waffles */}
          <h2 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-[#F2EEE6] leading-tight mb-8">
            Born from a Love of <br />
            <span className="font-script text-[#D4A85C] text-5xl sm:text-7xl md:text-8xl font-normal capitalize leading-[0.85] drop-shadow-[0_0_30px_rgba(212,168,92,0.5)] block mt-2">
              Waffles
            </span>
          </h2>

          <div className="w-16 h-[1px] bg-[#D4A85C]/40 mx-auto mb-8" />

          {/* Story Content Paragraphs matching Screenshot 4 */}
          <div className="space-y-6 max-w-3xl mx-auto font-dmsans text-sm sm:text-base text-[#F2EEE6]/85 leading-relaxed font-normal">
            <p>
              Welcome to HI Waffles, where every waffle is crafted with passion and dedication. What started as a small
              dream to serve the perfect dessert has blossomed into a sanctuary for chocolate lovers. We believe in using
              only the finest ingredients, hand-crafting our batter daily, and serving each waffle piping hot and golden.
            </p>
            <p>
              Whether you crave a classic milk chocolate drizzle or our loaded signature bubble bowl, our goal remains the
              same: to bring a smile to your face with every single bite. Thank you for being part of our sweet journey.
            </p>
          </div>

          {/* Bottom Heart Filigree Divider */}
          <div className="flex items-center justify-center gap-3 text-[#D4A85C] mt-10">
            <span className="w-12 h-[1px] bg-[#D4A85C]/40" />
            <Heart className="w-4 h-4 fill-[#D4A85C]" />
            <span className="w-12 h-[1px] bg-[#D4A85C]/40" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
