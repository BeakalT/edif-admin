import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '../../site/styles/fonts.css'
import '../../site/styles/base.css'
import '../../site/styles/pages.css'
import Layout from '../../site/components/Layout'
import { CmsProvider } from '../../site/cms-context'
import { SITE_URL, getCms } from '../../lib/cms'
import { getThemeCss } from '../../lib/theme'

export const revalidate = 3600 // safety net; publishing in the admin refreshes pages within seconds

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
