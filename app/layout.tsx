import type { Metadata } from "next";
import { Jost, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { TEXTS } from "@/hardcoded/texts";

// Titles: a transitional display serif, luxurious but sturdy enough to read; its italic is the burlesque accent.
const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  display: "swap",
});

// Text: a geometric art-deco sans that stays out of the way.
const body = Jost({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: TEXTS.SITE_METADATA_TITLE_1,
    template: `%s · ${TEXTS.SITE_METADATA_TITLE_1}`,
  },
  description: TEXTS.SITE_METADATA_DESCRIPTION_1,
  openGraph: {
    siteName: TEXTS.SITE_METADATA_TITLE_1,
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${display.variable} ${body.variable} bg-[#d8bfb6] antialiased`}>
        <Header />
        <main className="min-h-[70vh] w-full max-w-[738px] mx-auto">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
