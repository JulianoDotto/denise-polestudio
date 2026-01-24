import { cookies } from 'next/headers'
import crypto from 'crypto'
import type { Role } from '@prisma/client'

const COOKIE_NAME = 'admin_session'
const MAX_AGE = 60 * 60 * 24 * 7

export type SessionPayload = {
  userId: string
  role: Role
}

function getSecret() {
  return process.env.AUTH_SECRET || 'dev-secret-change-me'
}

function sign(value: string) {
  return crypto
    .createHmac('sha256', getSecret())
    .update(value)
    .digest('base64url')
}

export async function createSession(payload: SessionPayload) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = sign(data)
  const token = `${data}.${signature}`

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  const [data, signature] = token.split('.')
  if (!data || !signature) return null
  const expected = sign(data)
  const sigBuffer = Buffer.from(signature)
  const expBuffer = Buffer.from(expected)
  if (sigBuffer.length !== expBuffer.length) return null
  if (!crypto.timingSafeEqual(sigBuffer, expBuffer)) {
    return null
  }
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8'))
    return payload as SessionPayload
  } catch {
    return null
  }
}
