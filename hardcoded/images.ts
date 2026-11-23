export const IMAGES = {
  // Shown where a class or a store post has no photo of its own.
  SITE_FALLBACK_1: '/images/fallback-dg.svg',
  // Home photos come in two widths (scripts/home-images.py); the browser picks one through srcset.
  HOME_HERO_1: '/images/home/home-hero-853.webp',
  HOME_HERO_SRCSET_1: '/images/home/home-hero-480.webp 480w, /images/home/home-hero-853.webp 853w',
  // Already cropped to 4:5, the shape the home shows it in.
  HOME_SECTION_IMAGE_1: '/images/home/home-sobre-denise-800.webp',
  HOME_SECTION_IMAGE_SRCSET_1:
    '/images/home/home-sobre-denise-480.webp 480w, /images/home/home-sobre-denise-800.webp 800w',
  HOME_LINK_AULAS_1: '/images/home/link-aulas.webp',
  HOME_LINK_LOJA_1: '/images/home/link-loja.webp',
  HOME_LINK_PRODUTOS_DIGITAIS_1: '/images/home/link-produtos-digitais.webp',
  HOME_LINK_EVENTOS_1: '/images/home/link-eventos.webp',
  HOME_LINK_WORKSHOPS_1: '/images/home/link-workshops.webp',
} as const
