import type { MetadataRoute } from 'next'

import { buildSitemapEntries, getSiteUrl } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries(getSiteUrl(process.env.NEXT_PUBLIC_SITE_URL))
}
