"use client";

import { Sparkles, Award, Star } from "lucide-react";

export default function StatsBar() {
  const stats = [
    {
      icon: Sparkles,
      title: "12+ Signature Flavours",
      subtitle: "Handcrafted waffle variations",
    },
    {
      icon: Award,
      title: "100% Fresh Ingredients",
      subtitle: "Prepared daily to order",
    },
    {
      icon: Star,
      title: "5★ Guest Rating",
      subtitle: "Loved by dessert enthusiasts",
    },
  ];

  return (
    <div className="w-full bg-[#14100D] border-y border-[#D4A85C]/25 py-6 sm:py-8 px-4 relative z-30">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-[#D4A85C]/15">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`flex items-center justify-center md:justify-start gap-4 ${
                idx !== 0 ? "pt-6 md:pt-0 md:pl-8" : ""
              }`}
            >
              <div className="w-12 h-12 rounded-full border border-[#D4A85C]/40 bg-[#1E1814] flex items-center justify-center text-[#D4A85C] shadow-[0_0_15px_rgba(212,168,92,0.15)] flex-shrink-0">
                <Icon className="w-5 h-5 text-[#D4A85C]" />
              </div>
              <div className="flex flex-col">
                <span className="font-playfair text-xl sm:text-2xl font-bold text-[#D4A85C] tracking-wide">
                  {stat.title}
                </span>
                <span className="text-xs text-[#F2EEE6]/60 font-medium">
                  {stat.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
