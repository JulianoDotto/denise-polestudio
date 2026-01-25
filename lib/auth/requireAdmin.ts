import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth/authOptions'

export async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/403')

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || user.role !== 'ADMIN' || !user.isActive) redirect('/403')

  return user
}
