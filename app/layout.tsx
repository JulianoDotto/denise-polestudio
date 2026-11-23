import type { Metadata, Viewport } from "next";
import { Jost, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { TEXTS } from "@/hardcoded/texts";
import { preconnect } from "react-dom";
import { BASE_OPEN_GRAPH, buildStudioJsonLd, getSiteUrl, serializeJsonLd } from "@/lib/seo";
import { getBlobOrigin } from "@/lib/url-state";

const siteUrl = getSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
// Photos uploaded by the admin live on Vercel Blob; open the connection early.
const blobOrigin = getBlobOrigin(process.env.BLOB_STORE_ID);

// Titles: a transitional display serif, luxurious but sturdy enough to read; its italic is the burlesque accent.
const display = Playfair_Display({
  variable: "--font-display",
  // Portuguese fits in latin; latin-ext only added three more preloaded files.
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

// Text: a geometric art-deco sans that stays out of the way.
const body = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: TEXTS.SITE_METADATA_TITLE_1,
    template: `%s · ${TEXTS.SITE_METADATA_TITLE_1}`,
  },
  description: TEXTS.SITE_METADATA_DESCRIPTION_1,
  openGraph: BASE_OPEN_GRAPH,
};

// Matches the page and header background, so the mobile browser bar blends in.
export const viewport: Viewport = {
  themeColor: "#d8bfb6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (blobOrigin) preconnect(blobOrigin);

  return (
    <html lang="pt-BR">
      <body className={`${display.variable} ${body.variable} bg-[#d8bfb6] antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildStudioJsonLd(siteUrl)) }}
        />
        <a
          href="#conteudo"
          className="sr-only rounded-full bg-vinho px-5 py-3 text-sm text-marfim focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:outline-none focus:ring-2 focus:ring-marfim focus:ring-offset-2 focus:ring-offset-vinho"
        >
          {TEXTS.SITE_SKIP_LINK_1}
        </a>
        <Header />
        <main id="conteudo" tabIndex={-1} className="min-h-[70vh] w-full max-w-[738px] mx-auto focus:outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
