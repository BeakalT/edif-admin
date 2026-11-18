import { PageHero } from '@/site/components/ui'
import { notFound } from 'next/navigation'
import { NewsletterConfirm } from '@/site/components/Forms'

export const metadata = { title: 'Email updates | Ethiopian Deposit Insurance Fund', robots: { index: false } }
export const dynamic = 'force-dynamic'

export default async function Page({ searchParams }: { searchParams: Promise<{ action?: string; token?: string }> }) {
  if (process.env.NEXT_PUBLIC_NEWSLETTER !== 'on') notFound() // email updates are switched off for now
  const { action, token } = await searchParams
  const act = action === 'unsubscribe' ? 'unsubscribe' : 'confirm'
  return (
    <>
      <PageHero eyebrow="Email updates" title={act === 'confirm' ? 'Confirm your subscription' : 'Unsubscribe'} />
      <section className="section"><div className="container blk-narrow"><NewsletterConfirm action={act} token={String(token || '')} /></div></section>
    </>
  )
}
