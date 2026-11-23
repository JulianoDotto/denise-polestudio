import type { MetadataRoute } from 'next'

import { TEXTS } from '../hardcoded/texts'

// Public address of the site. The real domain comes later through NEXT_PUBLIC_SITE_URL.
export const DEFAULT_SITE_URL = 'https://denisegarcia.vercel.app'

export const PUBLIC_PATHS = ['/', '/aulas', '/workshops', '/eventos', '/produtos-digitais', '/loja'] as const

// Pages that must stay out of search results.
const PRIVATE_PATHS = ['/login', '/logout', '/403', '/api/']

export function getSiteUrl(raw?: string): string {
  const value = raw?.trim()
  if (!value) return DEFAULT_SITE_URL
  try {
    const url = new URL(value)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return DEFAULT_SITE_URL
    // Only the origin: a path, query or hash would break every URL built from it.
    return url.origin
  } catch {
    return DEFAULT_SITE_URL
  }
}

function absolute(siteUrl: string, path: string): string {
  return path === '/' ? siteUrl : `${siteUrl}${path}`
}

export function buildSitemapEntries(siteUrl: string): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.map((path) => ({ url: absolute(siteUrl, path) }))
}

export function buildRobots(siteUrl: string): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: PRIVATE_PATHS },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}

// Tells Google this is a local studio: address, phone, Instagram and the cities it serves.
export function buildStudioJsonLd(siteUrl: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: TEXTS.SITE_STUDIO_NAME_1,
    url: siteUrl,
    image: `${siteUrl}/opengraph-image.jpg`,
    telephone: `+${TEXTS.SITE_FOOTER_WHATSAPP_URL_1.replace(/\D/g, '')}`,
    sameAs: [TEXTS.SITE_FOOTER_INSTAGRAM_URL_1],
    address: {
      '@type': 'PostalAddress',
      streetAddress: TEXTS.SITE_FOOTER_ADDRESS_LINE_1,
      addressLocality: TEXTS.SITE_STUDIO_CITY_1,
      addressRegion: TEXTS.SITE_STUDIO_REGION_1,
      addressCountry: 'BR',
    },
    areaServed: [
      TEXTS.SITE_STUDIO_AREA_SERVED_1,
      TEXTS.SITE_STUDIO_AREA_SERVED_2,
      TEXTS.SITE_STUDIO_AREA_SERVED_3,
    ].map((name) => ({ '@type': 'City', name })),
  }
}

// Escapes "<" so text inside the JSON can never close the <script> tag.
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
