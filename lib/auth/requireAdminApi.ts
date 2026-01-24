import { prisma } from '@/lib/prisma'
import { getSession } from './session'

export async function requireAdminApi() {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') return null

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  })

  if (!user || user.role !== 'ADMIN' || !user.isActive) return null
  return user
}
