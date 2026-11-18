import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '../../site/styles/fonts.css'
import '../../site/styles/base.css'
import '../../site/styles/pages.css'
import Layout from '../../site/components/Layout'
import { CmsProvider } from '../../site/cms-context'
import { SITE_URL, getCms } from '../../lib/cms'
import { getThemeCss } from '../../lib/theme'

// Every page is rendered per visit so it can carry that visit's CSP nonce (see src/proxy.ts).
// The content itself is cached in lib/cms.ts and refreshed whenever something is published.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Ethiopian Deposit Insurance Fund', template: '%s' },
  icons: { icon: '/images/logoB.svg' },
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [cms, themeCss] = await Promise.all([getCms(), getThemeCss()])
  return (
    <html lang="en">
      <head>{themeCss ? <style dangerouslySetInnerHTML={{ __html: themeCss }} /> : null}</head>
      <body>
        <CmsProvider value={cms}>
          <Layout>{children}</Layout>
        </CmsProvider>
      </body>
    </html>
  )
}
