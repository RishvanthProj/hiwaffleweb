import Navbar from "./components/Navbar";
import WaffleReveal from "./components/WaffleReveal";
import CraftedWithPassion from "./components/CraftedWithPassion";
import ArtOfToppings from "./components/ArtOfToppings";
import MenuSection from "./components/MenuSection";
import OurStory from "./components/OurStory";
import ContactSection from "./components/ContactSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0E0906] text-[#F2EEE6] font-dmsans selection:bg-[#D4A85C] selection:text-[#0E0906]">
      {/* Fixed Luxury Navigation Header */}
      <Navbar />

      {/* Hero Scrollytelling Canvas Animation Section (Pure scroll-scrub + post-assembly text reveal) */}
      <WaffleReveal />

      {/* Section 2: Crafted With Passion (Where Every Bite Tells a Story) */}
      <CraftedWithPassion />

      {/* Section 3: The Art of Toppings (Every Layer, Perfectly Balanced) */}
      <ArtOfToppings />

      {/* Section 4: Handcrafted Menu & Special Offer Card */}
      <MenuSection />

      {/* Section 5: Our Story (Born from a Love of Waffles) */}
      <OurStory />

      {/* Section 6: Contact & Footer */}
      <ContactSection />
    </main>
  );
}
