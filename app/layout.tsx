import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Great_Vibes } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dmsans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-greatvibes",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HI Waffles | Indulge in Perfection",
  description:
    "Experience the ultimate dessert journey with HI Waffles. Crispy, warm & drizzled with rich chocolate. A dessert that feels like a celebration.",
  keywords: ["HI Waffles", "chocolate waffle", "desserts", "Krishnagiri waffles", "bubble bowl", "stick waffles"],
  openGraph: {
    title: "HI Waffles | Indulge in Perfection",
    description: "Handcrafted golden chocolate waffles drizzled with rich chocolate. Indulge in pure dessert perfection.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${greatVibes.variable}`}>
      <body className="bg-[#0E0906] text-[#F2EEE6] font-dmsans antialiased selection:bg-[#D4A85C] selection:text-[#0E0906]">
        {children}
      </body>
    </html>
  );
}
