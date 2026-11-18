'use server'
import { adminUrl } from '@/lib/adminRoute'
import { clientIpFrom } from '@/lib/clientIp'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import crypto from 'crypto'
import { notifyRoles } from '@/lib/notify'
import { send } from '@/lib/notify'
import { SITE_URL } from '@/lib/cms'

export type FormState = { ok?: boolean; error?: string }

const hits = new Map<string, number[]>()
const limited = (key: string, max: number, windowMs: number) => {
  const now = Date.now()
  const arr = (hits.get(key) || []).filter((t) => now - t < windowMs)
  arr.push(now)
  hits.set(key, arr)
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k)
  return arr.length > max
}
const ip = async () => { const h = await headers(); return clientIpFrom((n) => h.get(n)) }
const clean = (v: FormDataEntryValue | null, max: number) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max)
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function contactAction(_: FormState, fd: FormData): Promise<FormState> {
  // spam traps: a hidden field real people never fill, and a form that is submitted faster than a person can type
  if (clean(fd.get('website'), 100)) return { ok: true }
  const t = Number(fd.get('t'))
  if (!t || Date.now() - t < 4000) return { error: 'That was very quick. Please check your message and send it again.' }
  if (limited('contact:' + (await ip()), 5, 3600_000)) return { error: 'Too many messages from this connection. Please try again later or call us.' }
  const name = clean(fd.get('name'), 120), email = clean(fd.get('email'), 200), topic = clean(fd.get('topic'), 80), message = clean(fd.get('message'), 4000)
  if (!name || !EMAIL.test(email) || message.length < 10) return { error: 'Please enter your name, a valid email address and a message of at least 10 characters.' }
  if ((message.match(/https?:\/\//gi) || []).length > 3) return { error: 'Your message contains too many links.' }
  const payload = await getPayload({ config })
  await payload.create({ collection: 'messages', overrideAccess: true, context: { seeding: true }, data: { name, email, topic, subject: `${topic || 'Enquiry'} from ${name}`, message, status: 'new' } as any })
  notifyRoles(payload, ['admin', 'publisher'], 'New website message', [`${name} wrote about "${topic || 'general enquiry'}".`, 'Open the inbox to read and reply.'], { path: adminUrl('/collections/messages') })
  return { ok: true }
}

export async function subscribeAction(_: FormState, fd: FormData): Promise<FormState> {
  if (process.env.NEXT_PUBLIC_NEWSLETTER !== 'on') return { error: 'Email updates are not available at the moment.' }
  if (clean(fd.get('website'), 100)) return { ok: true }
  if (limited('sub:' + (await ip()), 5, 3600_000)) return { error: 'Too many attempts. Please try again later.' }
  const email = clean(fd.get('email'), 200).toLowerCase()
  if (!EMAIL.test(email)) return { error: 'Please enter a valid email address.' }
  const payload = await getPayload({ config })
  const sys = { overrideAccess: true as const, context: { seeding: true } }
  const ex = await payload.find({ collection: 'subscribers', where: { email: { equals: email } }, limit: 1, depth: 0, ...sys })
  let token = (ex.docs[0] as any)?.token as string | undefined
  if (!ex.docs[0]) {
    token = crypto.randomBytes(24).toString('hex')
    await payload.create({ collection: 'subscribers', data: { email, status: 'pending', token } as any, ...sys })
  } else if ((ex.docs[0] as any).status === 'unsubscribed') {
    token = crypto.randomBytes(24).toString('hex')
    await payload.update({ collection: 'subscribers', id: ex.docs[0].id, data: { status: 'pending', token } as any, ...sys })
  }
  // same answer whether or not the address was already known, so the form cannot be used to check who subscribed
  if (token && (ex.docs[0] as any)?.status !== 'confirmed') {
    await send(payload, [email], 'Confirm your subscription to EDIF updates', ['Please confirm that you want to receive updates from the Ethiopian Deposit Insurance Fund.', 'If you did not ask for this, ignore this email and nothing will happen.'], { href: `${SITE_URL}/newsletter?action=confirm&token=${token}`, label: 'Confirm my subscription' }).catch(() => {})
  }
  return { ok: true }
}

export async function newsletterAction(_: FormState, fd: FormData): Promise<FormState> {
  if (process.env.NEXT_PUBLIC_NEWSLETTER !== 'on') return { error: 'Email updates are not available at the moment.' }
  const token = clean(fd.get('token'), 100), action = clean(fd.get('action'), 20)
  if (!/^[a-f0-9]{48}$/.test(token) || !['confirm', 'unsubscribe'].includes(action)) return { error: 'This link is not valid.' }
  if (limited('nl:' + (await ip()), 20, 3600_000)) return { error: 'Too many attempts. Please try again later.' }
  const payload = await getPayload({ config })
  const sys = { overrideAccess: true as const, context: { seeding: true } }
  const r = await payload.find({ collection: 'subscribers', where: { token: { equals: token } }, limit: 1, depth: 0, ...sys })
  const s: any = r.docs[0]
  if (!s) return { error: 'This link is not valid or has already been used.' }
  await payload.update({ collection: 'subscribers', id: s.id, data: action === 'confirm' ? { status: 'confirmed', confirmedAt: new Date().toISOString() } : { status: 'unsubscribed' } as any, ...sys })
  return { ok: true }
}
