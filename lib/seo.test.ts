import assert from 'node:assert/strict'
import test from 'node:test'

import { TEXTS } from '../hardcoded/texts'
import {
  DEFAULT_SITE_URL,
  PUBLIC_PATHS,
  buildRobots,
  buildSitemapEntries,
  buildStudioJsonLd,
  getSiteUrl,
  serializeJsonLd,
} from './seo'

test('site url falls back to the default when missing or invalid', () => {
  for (const raw of [undefined, '', '   ', 'denisegarcia.com.br', 'ftp://x.com']) {
    assert.equal(getSiteUrl(raw), DEFAULT_SITE_URL)
  }
})

test('site url keeps a valid value and drops trailing slashes', () => {
  assert.equal(getSiteUrl('https://denisegarcia.com.br/'), 'https://denisegarcia.com.br')
  assert.equal(getSiteUrl('  https://denisegarcia.com.br  '), 'https://denisegarcia.com.br')
})

test('sitemap lists the six public pages under the site url', () => {
  const urls = buildSitemapEntries('https://x.com.br').map((entry) => entry.url)
  assert.deepEqual(urls, [
    'https://x.com.br',
    'https://x.com.br/aulas',
    'https://x.com.br/workshops',
    'https://x.com.br/eventos',
    'https://x.com.br/produtos-digitais',
    'https://x.com.br/loja',
  ])
  assert.equal(PUBLIC_PATHS.length, 6)
})

test('robots allows the site, blocks internal pages and points to the sitemap', () => {
  const robots = buildRobots('https://x.com.br')
  const rule = Array.isArray(robots.rules) ? robots.rules[0] : robots.rules
  assert.equal(rule.userAgent, '*')
  assert.equal(rule.allow, '/')
  assert.deepEqual(rule.disallow, ['/login', '/logout', '/403', '/api/'])
  assert.equal(robots.sitemap, 'https://x.com.br/sitemap.xml')
})

test('studio json-ld describes the local studio from the site texts', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = buildStudioJsonLd('https://x.com.br') as any
  assert.equal(data['@context'], 'https://schema.org')
  assert.equal(data['@type'], 'SportsActivityLocation')
  assert.equal(data.name, TEXTS.SITE_STUDIO_NAME_1)
  assert.equal(data.url, 'https://x.com.br')
  assert.equal(data.image, 'https://x.com.br/opengraph-image.jpg')
  assert.equal(data.telephone, '+5512988153159')
  assert.deepEqual(data.sameAs, [TEXTS.SITE_FOOTER_INSTAGRAM_URL_1])
  assert.deepEqual(data.address, {
    '@type': 'PostalAddress',
    streetAddress: TEXTS.SITE_FOOTER_ADDRESS_LINE_1,
    addressLocality: 'Caçapava',
    addressRegion: 'SP',
    addressCountry: 'BR',
  })
  assert.deepEqual(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.areaServed.map((city: any) => [city['@type'], city.name]),
    [
      ['City', 'Caçapava'],
      ['City', 'São José dos Campos'],
      ['City', 'Taubaté'],
    ],
  )
  assert.equal('openingHoursSpecification' in data, false)
})

test('json-ld serialization cannot close the script tag', () => {
  const out = serializeJsonLd({ name: '</script><script>alert(1)</script>' })
  assert.equal(out.includes('<'), false)
  assert.deepEqual(JSON.parse(out), { name: '</script><script>alert(1)</script>' })
})
