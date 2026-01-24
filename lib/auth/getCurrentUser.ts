import { prisma } from '@/lib/prisma'
import { getSession } from './session'

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    })
    if (!user || !user.isActive) return null
    return user
  } catch {
    return null
  }
}
