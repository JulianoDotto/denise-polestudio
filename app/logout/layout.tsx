import type { Metadata } from 'next'

// The logout page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function LogoutLayout({ children }: { children: React.ReactNode }) {
  return children
}
