import { getServerSession } from 'next-auth'

import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth/authOptions'

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })
    if (!user || !user.isActive) return null
    return user
  } catch {
    return null
  }
}
