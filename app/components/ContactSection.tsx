"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, MessageSquare, Instagram, MapPin, Send } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi HI Waffles!\nName: ${formData.name}\nPhone: ${formData.phone}\nMessage: ${formData.message}`;
    const url = `https://wa.me/919786041215?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <section id="contact" className="relative py-28 px-6 sm:px-12 md:px-16 lg:px-24 bg-[#0E0906] overflow-hidden">
      {/* Dark Ambient Warm Radial Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(51,37,28,0.35)_0%,rgba(14,9,6,0.95)_100%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-14">
          <h2 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F2EEE6] tracking-tight">
            Contact Us
          </h2>
          <div className="w-16 h-[2px] bg-[#D4A85C] mt-4" />
        </div>

        {/* Grid Layout matching Screenshot 5 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: 3 Contact Info Cards matching Screenshot 5 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-4 flex flex-col gap-6"
          >
            {/* Card 1: CALL / WHATSAPP */}
            <div className="p-6 sm:p-8 rounded-2xl border border-[#D4A85C]/40 bg-[#1C1714]/80 backdrop-blur-md shadow-xl flex flex-col items-center text-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A85C] mb-4">
                CALL / WHATSAPP
              </span>
              <div className="flex flex-col gap-3">
                <a
                  href="tel:9786041215"
                  className="flex items-center gap-3 text-lg font-bold text-[#F2EEE6] hover:text-[#D4A85C] transition-colors"
                >
                  <span className="p-2 rounded-full bg-[#D4A85C]/20 text-[#D4A85C]">
                    <Phone className="w-4 h-4" />
                  </span>
                  <span>9786041215</span>
                </a>
                <a
                  href="https://wa.me/918870544916"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-lg font-bold text-[#F2EEE6] hover:text-[#25D366] transition-colors"
                >
                  <span className="p-2 rounded-full bg-[#25D366]/20 text-[#25D366]">
                    <MessageSquare className="w-4 h-4" />
                  </span>
                  <span>8870544916</span>
                </a>
              </div>
            </div>

            {/* Card 2: FOLLOW US */}
            <div className="p-6 sm:p-8 rounded-2xl border border-[#D4A85C]/40 bg-[#1C1714]/80 backdrop-blur-md shadow-xl flex flex-col items-center text-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A85C] mb-4">
                FOLLOW US
              </span>
              <a
                href="https://instagram.com/hiwaffleofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-base font-bold text-[#F2EEE6] hover:text-[#E1306C] transition-colors"
              >
                <span className="p-2 rounded-full bg-[#E1306C]/20 text-[#E1306C]">
                  <Instagram className="w-5 h-5" />
                </span>
                <span>@hiwaffleofficial</span>
              </a>
            </div>

            {/* Card 3: VISIT US */}
            <div className="p-6 sm:p-8 rounded-2xl border border-[#D4A85C]/40 bg-[#1C1714]/80 backdrop-blur-md shadow-xl flex flex-col items-center text-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A85C] mb-4">
                VISIT US
              </span>
              <div className="flex items-start gap-3 text-xs sm:text-sm font-semibold text-[#F2EEE6]/90 leading-relaxed text-center">
                <span className="p-2 rounded-full bg-[#D4A85C]/20 text-[#D4A85C] flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </span>
                <span>
                  3/414/5, opp KATTIGANA PALLI LAKE <br />
                  PERIYAR NAGAR, KRISHNAGIRI
                </span>
              </div>
            </div>
          </motion.div>

          {/* Center Column: SEND A MESSAGE Form Card matching Screenshot 5 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-8 p-8 sm:p-12 rounded-3xl border border-[#D4A85C]/40 bg-gradient-to-b from-[#1C1714]/90 to-[#0E0906]/95 backdrop-blur-xl shadow-2xl"
          >
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4A85C]">
                SEND A MESSAGE
              </span>
              <p className="text-xs sm:text-sm text-[#F2EEE6]/70 mt-2">
                Have a bulk order or special request? Let us know!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl bg-[#0E0906]/80 border border-[#D4A85C]/30 text-[#F2EEE6] text-sm placeholder-[#F2EEE6]/40 focus:outline-none focus:border-[#D4A85C] transition-colors"
                />
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Your Phone Number"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl bg-[#0E0906]/80 border border-[#D4A85C]/30 text-[#F2EEE6] text-sm placeholder-[#F2EEE6]/40 focus:outline-none focus:border-[#D4A85C] transition-colors"
                />
              </div>

              <div>
                <textarea
                  rows={4}
                  placeholder="Your Message (e.g. Bulk Order Inquiry)"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl bg-[#0E0906]/80 border border-[#D4A85C]/30 text-[#F2EEE6] text-sm placeholder-[#F2EEE6]/40 focus:outline-none focus:border-[#D4A85C] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-[#D4A85C] text-[#0E0906] font-extrabold text-xs uppercase tracking-[0.2em] hover:bg-[#B98A3F] transition-all duration-300 shadow-xl flex items-center justify-center gap-2 mt-2"
              >
                <Send className="w-4 h-4" />
                SEND VIA WHATSAPP
              </button>
            </form>
          </motion.div>
        </div>

        {/* Footer Bottom Bar matching Screenshot 5 */}
        <div className="mt-20 pt-8 border-t border-[#D4A85C]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#F2EEE6]/50">
          <div>© 2026 HI WAFFLES. ALL RIGHTS RESERVED.</div>
          <div className="flex items-center gap-2">
            <span>DESIGNED BY -</span>
            <span className="font-script text-base text-[#D4A85C]">HI Waffles Team</span>
          </div>
        </div>
      </div>
    </section>
  );
}
