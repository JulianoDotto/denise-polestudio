import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { TEXTS } from "@/hardcoded/texts";

const display = localFont({
  variable: "--font-display",
  src: "../public/fonts/Aboreto-Regular.ttf",
  weight: "400",
  display: "swap",
});

const body = localFont({
  variable: "--font-body",
  src: "../public/fonts/apple-sd-gothic-neo-regular.otf",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: TEXTS.SITE_METADATA_TITLE_1,
  description: TEXTS.SITE_METADATA_DESCRIPTION_1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${display.variable} ${body.variable} bg-[#FDFDFD] antialiased`}>
        <Header />
        <main className="min-h-[70vh] w-full max-w-[738px] mx-auto">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
