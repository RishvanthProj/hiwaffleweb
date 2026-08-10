"use client";

import { useState, useEffect } from "react";
import { Menu, X, MessageSquare, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "HOME", href: "#experience", active: true },
    { name: "MENU", href: "#menu" },
    { name: "ABOUT US", href: "#story" },
    { name: "CONTACT US", href: "#contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0E0906]/90 backdrop-blur-md border-b border-[#D4A85C]/20 py-3 shadow-2xl"
            : "bg-gradient-to-b from-[#0E0906]/90 via-[#0E0906]/40 to-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex items-center justify-between">
          {/* Brand Logo matching reference screenshot */}
          <a href="#" className="flex flex-col group">
            <span className="font-playfair text-2xl sm:text-3xl font-bold tracking-tight text-[#D4A85C] leading-none">
              HI WAFFLES
            </span>
            <div className="w-full h-[1px] bg-gradient-to-r from-[#D4A85C] via-[#D4A85C]/50 to-transparent mt-1" />
          </a>

          {/* Center Navigation Links matching reference screenshot */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-xs font-semibold tracking-[0.2em] transition-all py-1 border-b-2 ${
                  link.active
                    ? "text-[#D4A85C] border-[#D4A85C]"
                    : "text-[#F2EEE6]/70 border-transparent hover:text-[#D4A85C]"
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Button */}
          <div className="hidden md:flex items-center">
            <a
              href="https://wa.me/919786041215?text=Hi%20HI%20Waffles!%20I'd%20like%20to%20place%20an%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded border border-[#D4A85C]/60 bg-[#1C1714]/80 text-[#D4A85C] text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#D4A85C] hover:text-[#0E0906] transition-all duration-300 shadow-md backdrop-blur-md"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WHATSAPP ORDER
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded border border-[#D4A85C]/40 text-[#D4A85C] hover:bg-[#1C1714] transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[65px] z-40 bg-[#0E0906]/95 backdrop-blur-xl border-b border-[#D4A85C]/30 p-6 md:hidden shadow-2xl"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold tracking-widest text-[#F2EEE6] hover:text-[#D4A85C] py-2 border-b border-[#D4A85C]/10 flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <span className="text-[#D4A85C]">→</span>
                </a>
              ))}
              <a
                href="https://wa.me/919786041215?text=Hi%20HI%20Waffles!%20I'd%20like%20to%20place%20an%20order."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded bg-[#D4A85C] text-[#0E0906] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 mt-2"
              >
                <MessageSquare className="w-4 h-4" />
                WHATSAPP ORDER
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
