import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Account recovery | EDIF admin', robots: { index: false, follow: false } }

export default function RecoveryLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif', background: '#f5f6f7', color: '#14213d' }}>
        <main style={{ maxWidth: 480, margin: '0 auto', padding: '48px 16px' }}>{children}</main>
      </body>
    </html>
  )
}
