"use client";

import { motion } from "framer-motion";

interface MenuItem {
  name: string;
  price: string;
}

const classicWaffles: MenuItem[] = [
  { name: "Milk Chocolate", price: "₹79" },
  { name: "Dark Chocolate", price: "₹79" },
  { name: "White Chocolate", price: "₹79" },
  { name: "White & Dark", price: "₹89" },
  { name: "Death by Chocolate", price: "₹89" },
  { name: "Nutella", price: "₹99" },
  { name: "Chocolate Coffee", price: "₹99" },
  { name: "Triple Chocolate", price: "₹99" },
  { name: "Butterscotch", price: "₹99" },
  { name: "Cotton Candy", price: "₹109" },
  { name: "Crunchy Choco", price: "₹109" },
  { name: "Cookies & Cream", price: "₹109" },
  { name: "Lotus Biscoff", price: "₹109" },
  { name: "Caramel", price: "₹109" },
  { name: "Blue Berry", price: "₹109" },
  { name: "Red Velvet", price: "₹109" },
  { name: "Kuwafa Chocolate", price: "₹109" },
];

const stickWaffles: MenuItem[] = [
  { name: "White Chocolate", price: "₹69" },
  { name: "Dark Chocolate", price: "₹69" },
  { name: "Milk Chocolate", price: "₹69" },
  { name: "Triple Chocolate", price: "₹74" },
  { name: "Cookies & Cream", price: "₹85" },
  { name: "Lotus Biscoff", price: "₹95" },
];

const bowlCakes: MenuItem[] = [
  { name: "Triple Chocolate", price: "₹149" },
  { name: "Oreo", price: "₹149" },
  { name: "Banana", price: "₹149" },
  { name: "Biscoff", price: "₹159" },
  { name: "Nutella", price: "₹159" },
  { name: "Brownie Blast Bowl", price: "₹169" },
];

const addOns: MenuItem[] = [
  { name: "Extra Chocolate", price: "₹20" },
  { name: "Extra Nutella", price: "₹20" },
  { name: "Ice Cream Scoop", price: "₹30" },
];

const bubbleBowls: MenuItem[] = [
  { name: "Triple Chocolate", price: "₹149" },
  { name: "Ice Cream", price: "₹159" },
  { name: "Ice Cream + Banana + Strawberry", price: "₹189" },
];

export default function MenuSection() {
  return (
    <section id="menu" className="relative py-28 px-6 sm:px-12 md:px-16 lg:px-24 bg-[#0E0906] overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(51,37,28,0.3)_0%,rgba(14,9,6,0.95)_100%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 text-[#D4A85C] text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] mb-3">
            <span className="w-8 h-[1px] bg-[#D4A85C]" />
            <span>OUR SELECTION</span>
            <span className="w-8 h-[1px] bg-[#D4A85C]" />
          </div>
          <h2 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F2EEE6] leading-tight">
            Handcrafted <span className="font-script text-[#D4A85C] text-5xl sm:text-6xl lg:text-7xl font-normal capitalize">Menu</span>
          </h2>
        </div>

        {/* 3 Column Menu Grid matching Screenshot 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
          {/* Column 1: Classic Waffles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-2 text-[#D4A85C] text-sm font-bold uppercase tracking-[0.2em] mb-6 pb-3 border-b border-[#D4A85C]/30">
              <span className="text-lg">🧇</span>
              <span>CLASSIC WAFFLES</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm">
              {classicWaffles.map((item) => (
                <li key={item.name} className="flex items-center justify-between group">
                  <span className="text-[#F2EEE6]/85 group-hover:text-[#D4A85C] transition-colors">
                    • {item.name}
                  </span>
                  <span className="font-mono text-[#D4A85C] font-semibold">{item.price}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 2: Stick Waffles + Bowl Cakes + Add Ons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col gap-10"
          >
            {/* Stick Waffles */}
            <div>
              <div className="flex items-center gap-2 text-[#D4A85C] text-sm font-bold uppercase tracking-[0.2em] mb-6 pb-3 border-b border-[#D4A85C]/30">
                <span className="text-lg">🍡</span>
                <span>STICK WAFFLES</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm">
                {stickWaffles.map((item) => (
                  <li key={item.name} className="flex items-center justify-between group">
                    <span className="text-[#F2EEE6]/85 group-hover:text-[#D4A85C] transition-colors">
                      • {item.name}
                    </span>
                    <span className="font-mono text-[#D4A85C] font-semibold">{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bowl Cakes */}
            <div>
              <div className="flex items-center gap-2 text-[#D4A85C] text-sm font-bold uppercase tracking-[0.2em] mb-6 pb-3 border-b border-[#D4A85C]/30">
                <span className="text-lg">🍨</span>
                <span>BOWL CAKES</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm">
                {bowlCakes.map((item) => (
                  <li key={item.name} className="flex items-center justify-between group">
                    <span className="text-[#F2EEE6]/85 group-hover:text-[#D4A85C] transition-colors">
                      • {item.name}
                    </span>
                    <span className="font-mono text-[#D4A85C] font-semibold">{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Add On */}
            <div>
              <div className="flex items-center gap-2 text-[#D4A85C] text-sm font-bold uppercase tracking-[0.2em] mb-6 pb-3 border-b border-[#D4A85C]/30">
                <span className="text-lg">➕</span>
                <span>ADD ON</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm">
                {addOns.map((item) => (
                  <li key={item.name} className="flex items-center justify-between group">
                    <span className="text-[#F2EEE6]/85 group-hover:text-[#D4A85C] transition-colors">
                      • {item.name}
                    </span>
                    <span className="font-mono text-[#D4A85C] font-semibold">{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Column 3: Bubble Bowl + Special Offer Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col gap-10"
          >
            {/* Bubble Bowl */}
            <div>
              <div className="flex items-center gap-2 text-[#D4A85C] text-sm font-bold uppercase tracking-[0.2em] mb-6 pb-3 border-b border-[#D4A85C]/30">
                <span className="text-lg">🥣</span>
                <span>BUBBLE BOWL</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm mb-8">
                {bubbleBowls.map((item) => (
                  <li key={item.name} className="flex items-center justify-between group">
                    <span className="text-[#F2EEE6]/85 group-hover:text-[#D4A85C] transition-colors">
                      • {item.name}
                    </span>
                    <span className="font-mono text-[#D4A85C] font-semibold">{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ornate Special Offer Card matching Screenshot 3 */}
            <div className="relative p-6 sm:p-8 rounded-2xl border-2 border-[#D4A85C]/60 bg-gradient-to-b from-[#1C1714] to-[#0E0906] shadow-[0_0_40px_rgba(212,168,92,0.25)] text-center overflow-hidden">
              {/* Ornate Gold Filigree Corners */}
              <div className="absolute top-2 left-2 text-[#D4A85C]/60 text-xs">✦</div>
              <div className="absolute top-2 right-2 text-[#D4A85C]/60 text-xs">✦</div>
              <div className="absolute bottom-2 left-2 text-[#D4A85C]/60 text-xs">✦</div>
              <div className="absolute bottom-2 right-2 text-[#D4A85C]/60 text-xs">✦</div>

              {/* Ribbon Header */}
              <div className="inline-block px-4 py-1 rounded-full bg-[#D4A85C] text-[#0E0906] text-[10px] font-extrabold uppercase tracking-[0.25em] mb-5 shadow-md">
                ✦ SPECIAL OFFER ✦
              </div>

              <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#F2EEE6] leading-tight mb-2">
                BUY <span className="text-[#D4A85C] text-3xl font-extrabold">10</span> WAFFLES
              </h3>

              <div className="font-playfair text-2xl sm:text-3xl font-extrabold text-[#D4A85C] tracking-tight mb-3">
                GET 11<sup className="text-sm">th</sup> WAFFLE <br />
                <span className="text-3xl sm:text-4xl text-[#F2EEE6] tracking-wider uppercase">FREE!</span>
              </div>

              <div className="w-16 h-[1px] bg-[#D4A85C]/40 mx-auto mb-4" />

              <p className="text-xs font-semibold uppercase tracking-widest text-[#D4A85C] mb-4">
                🎁 11th WAFFLE IS ON US!
              </p>

              <span className="text-[9px] font-mono uppercase tracking-widest text-[#F2EEE6]/50">
                T&C APPLY*
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
