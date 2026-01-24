import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { getSession } from './session'

export async function requireAdmin() {
  const session = await getSession()
  if (!session) {
    redirect('/admin/login')
  }

  if (session.role !== 'ADMIN') {
    redirect('/403')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  })

  if (!user || user.role !== 'ADMIN' || !user.isActive) {
    redirect('/403')
  }

  return user
}
