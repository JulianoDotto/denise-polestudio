import 'dotenv/config'
import { PrismaClient, ItemType, Role } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { hash } from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
})

async function main() {
  await prisma.itemImage.deleteMany()
  await prisma.item.deleteMany()
  await prisma.storePost.deleteMany()
  await prisma.storeSection.deleteMany()
  await prisma.user.deleteMany()

  const poleSection = await prisma.storeSection.create({
    data: {
      slug: 'pole-dance',
      title: 'Loja Pole Dance',
      isAdult: false,
      isActive: true,
      bannerUrl: '/images/banner-pole.svg',
      order: 1,
    },
  })

  const sexshopSection = await prisma.storeSection.create({
    data: {
      slug: 'sexshop',
      title: 'Loja Sexshop',
      isAdult: true,
      isActive: true,
      bannerUrl: '/images/banner-sexshop.svg',
      order: 2,
    },
  })

  const products = [
    {
      slug: 'luva-grip-pole',
      title: 'Luva Grip Pole',
      priceCents: 8900,
      coverUrl: '/images/placeholder.svg',
      description: 'Luva com textura antiderrapante para treinos de pole dance.',
      storeSectionId: poleSection.id,
      order: 1,
    },
    {
      slug: 'top-sport-preto',
      title: 'Top Sport Preto',
      priceCents: 11900,
      coverUrl: '/images/placeholder.svg',
      description: 'Top confortável para treino e apresentações.',
      storeSectionId: poleSection.id,
      order: 2,
    },
    {
      slug: 'kit-higienizacao-pole',
      title: 'Kit Higienização Pole',
      priceCents: 5900,
      coverUrl: '/images/placeholder.svg',
      description: 'Kit com spray e flanela para limpeza do pole.',
      storeSectionId: poleSection.id,
      order: 3,
    },
    {
      slug: 'vela-aromatica-sensual',
      title: 'Vela Aromática Sensual',
      priceCents: 7500,
      coverUrl: '/images/placeholder.svg',
      description: 'Vela perfumada para criar clima especial.',
      storeSectionId: sexshopSection.id,
      order: 1,
    },
    {
      slug: 'oleo-massagem',
      title: 'Óleo de Massagem',
      priceCents: 6500,
      coverUrl: '/images/placeholder.svg',
      description: 'Óleo hidratante com toque sedoso.',
      storeSectionId: sexshopSection.id,
      order: 2,
    },
    {
      slug: 'algemas-satin',
      title: 'Algemas Satin',
      priceCents: 9900,
      coverUrl: '/images/placeholder.svg',
      description: 'Algemas confortáveis com acabamento em cetim.',
      storeSectionId: sexshopSection.id,
      order: 3,
    },
  ]

  for (const product of products) {
    await prisma.item.create({
      data: {
        type: ItemType.PRODUCT,
        slug: product.slug,
        title: product.title,
        priceCents: product.priceCents,
        coverUrl: product.coverUrl,
        description: product.description,
        storeSectionId: product.storeSectionId,
        order: product.order,
        images: {
          create: [{
            url: product.coverUrl,
            alt: product.title,
            order: 1,
          }],
        },
      },
    })
  }

  const classes = [
    {
      slug: 'pole-dance',
      title: 'Pole Dance',
      coverUrl: '/images/placeholder.svg',
      description: 'Aula completa de pole dance com foco em força e fluidez.',
      order: 1,
      hotmartUrl: 'https://hotmart.com',
      whatsappTextTemplate: 'Olá, quero agendar a aula de Pole Dance.',
    },
    {
      slug: 'bed-dance',
      title: 'Bed Dance',
      coverUrl: '/images/placeholder.svg',
      description: 'Movimentos sensuais e coreografias adaptadas para cama.',
      order: 2,
      hotmartUrl: 'https://hotmart.com',
      whatsappTextTemplate: 'Olá, quero agendar a aula de Bed Dance.',
    },
    {
      slug: 'chair',
      title: 'Chair Dance',
      coverUrl: '/images/placeholder.svg',
      description: 'Exploração do chair dance com técnicas de postura e sedução.',
      order: 3,
      hotmartUrl: 'https://hotmart.com',
      whatsappTextTemplate: 'Olá, quero agendar a aula de Chair Dance.',
    },
    {
      slug: 'artes-sensuais',
      title: 'Artes Sensuais',
      coverUrl: '/images/placeholder.svg',
      description: 'Aulas que conectam sensualidade, expressão e autoestima.',
      order: 4,
      hotmartUrl: 'https://hotmart.com',
      whatsappTextTemplate: 'Olá, quero agendar a aula de Artes Sensuais.',
    },
  ]

  for (const aula of classes) {
    await prisma.item.create({
      data: {
        type: ItemType.CLASS,
        slug: aula.slug,
        title: aula.title,
        coverUrl: aula.coverUrl,
        description: aula.description,
        order: aula.order,
        hotmartUrl: aula.hotmartUrl,
        whatsappTextTemplate: aula.whatsappTextTemplate,
        images: {
          create: [{
            url: aula.coverUrl,
            alt: aula.title,
            order: 1,
          }],
        },
      },
    })
  }

  const ebooks = [
    {
      slug: 'ebook-autoconfianca',
      title: 'Ebook Autoconfiança',
      priceCents: 4900,
      coverUrl: '/images/placeholder.svg',
      description: 'Dicas práticas para fortalecer sua autoestima.',
      order: 1,
      whatsappTextTemplate: 'Olá, quero comprar o ebook Autoconfiança.',
    },
    {
      slug: 'ebook-coreografias',
      title: 'Ebook Coreografias',
      priceCents: 5900,
      coverUrl: '/images/placeholder.svg',
      description: 'Sequências e ideias de coreografias sensuais.',
      order: 2,
      whatsappTextTemplate: 'Olá, quero comprar o ebook Coreografias.',
    },
  ]

  for (const ebook of ebooks) {
    await prisma.item.create({
      data: {
        type: ItemType.EBOOK,
        slug: ebook.slug,
        title: ebook.title,
        priceCents: ebook.priceCents,
        coverUrl: ebook.coverUrl,
        description: ebook.description,
        order: ebook.order,
        whatsappTextTemplate: ebook.whatsappTextTemplate,
        images: {
          create: [{
            url: ebook.coverUrl,
            alt: ebook.title,
            order: 1,
          }],
        },
      },
    })
  }

  const events = [
    {
      slug: 'imersao-sensual',
      title: 'Imersão Artes Sensuais',
      description: '12 JUN - Imersão presencial com práticas e vivências.',
      eventDate: new Date('2026-06-12'),
      order: 1,
      whatsappTextTemplate: 'Olá, quero informações sobre a Imersão Artes Sensuais.',
    },
    {
      slug: 'evento-bed-dance',
      title: 'Evento Bed Dance',
      description: '05 JUL - Evento especial com coreografias e apresentações.',
      eventDate: new Date('2026-07-05'),
      order: 2,
      whatsappTextTemplate: 'Olá, quero informações sobre o Evento Bed Dance.',
    },
  ]

  for (const evento of events) {
    await prisma.item.create({
      data: {
        type: ItemType.EVENT,
        slug: evento.slug,
        title: evento.title,
        description: evento.description,
        eventDate: evento.eventDate,
        order: evento.order,
        whatsappTextTemplate: evento.whatsappTextTemplate,
      },
    })
  }

  const workshops = [
    {
      slug: 'workshop-sensualidade',
      title: 'Workshop de Sensualidade',
      description: 'Técnicas de expressão corporal, musicalidade e confiança no movimento.',
      order: 1,
      whatsappTextTemplate: 'Olá, quero informações sobre o Workshop de Sensualidade.',
    },
    {
      slug: 'workshop-flexibilidade',
      title: 'Workshop de Flexibilidade',
      description: 'Sequências guiadas para ampliar mobilidade e força com segurança.',
      order: 2,
      whatsappTextTemplate: 'Olá, quero informações sobre o Workshop de Flexibilidade.',
    },
    {
      slug: 'workshop-coreografico',
      title: 'Workshop Coreográfico',
      description: 'Criação de coreografias com foco em presença e interpretação.',
      order: 3,
      whatsappTextTemplate: 'Olá, quero informações sobre o Workshop Coreográfico.',
    },
  ]

  for (const workshop of workshops) {
    await prisma.item.create({
      data: {
        type: ItemType.WORKSHOP,
        slug: workshop.slug,
        title: workshop.title,
        description: workshop.description,
        order: workshop.order,
        whatsappTextTemplate: workshop.whatsappTextTemplate,
      },
    })
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@local'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const adminHash = await hash(adminPassword, 10)

  await prisma.user.create({
    data: {
      email: adminEmail,
      name: 'Admin',
      passwordHash: adminHash,
      role: Role.ADMIN,
      isActive: true,
    },
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
