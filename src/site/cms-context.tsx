'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Contact, Doc, Faq } from './data/content'
import type { Article } from './data/news'
import type { Member } from './data/members'

export type NavItem = { label: string; url: string; description?: string; children?: NavItem[] }
export type Notice = { message: string; severity: 'info' | 'warning' | 'urgent'; linkLabel?: string; linkUrl?: string; expiresAt?: string }
export type Figure = { label: string; value: string; numeric?: number; note?: string; source: string; asOf: string }
export type Cms = {
  nav?: NavItem[]; footerNav?: { heading: string; links: NavItem[] }[]; headerCta?: { label: string; url: string }
  logo?: { color?: string; white?: string; wordmark: string; textOnly?: boolean }; notice?: Notice | null; figures?: Record<string, Figure>
  articles: Article[]; docs: Doc[]; faqs: Faq[]; banks: Member[]; microfinance: Member[]; contact: Contact }
const Ctx = createContext<Cms | null>(null)
export const CmsProvider = ({ value, children }: { value: Cms; children: ReactNode }) => <Ctx.Provider value={value}>{children}</Ctx.Provider>
export const useCms = () => {
  const v = useContext(Ctx)
  if (!v) throw new Error('CmsProvider missing')
  return v
}
