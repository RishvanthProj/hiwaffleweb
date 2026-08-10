"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0E0906] py-10 px-4 sm:px-6 lg:px-8 border-t border-[#D4A85C]/20">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-[#F2EEE6]/50">
        <div className="flex items-center gap-2">
          <span className="font-playfair font-bold text-[#D4A85C] text-sm">HI WAFFLES</span>
          <span>© {currentYear} HI Waffles. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-1 text-[#F2EEE6]/60">
          <span>Designed with passion for perfection</span>
        </div>
      </div>
    </footer>
  );
}
