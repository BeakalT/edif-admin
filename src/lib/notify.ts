import type { Payload } from 'payload'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const SITE = () => process.env.SITE_URL || 'http://localhost:3100'

export const mailHtml = (heading: string, lines: string[], link?: { href: string; label: string }) =>
  `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1a2b2b"><h2 style="color:#0b4f4a">${esc(heading)}</h2>${lines.map((l) => `<p>${esc(l)}</p>`).join('')}${
    link ? `<p><a href="${link.href}" style="background:#0b4f4a;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;display:inline-block">${esc(link.label)}</a></p>` : ''
  }<hr style="border:none;border-top:1px solid #ddd"><p style="font-size:12px;color:#666">EDIF website administration. If you did not expect this message, contact your Super Admin.</p></div>`

export async function send(payload: Payload, to: string[], subject: string, lines: string[], link?: { href: string; label: string }) {
  if (!to.length) return
  try {
    await payload.sendEmail({ to: to.join(', '), subject: `[EDIF Admin] ${subject}`, text: `${lines.join('\n\n')}${link ? `\n\n${link.label}: ${link.href}` : ''}`, html: mailHtml(subject, lines, link) })
  } catch (e) {
    payload.logger.warn({ err: e }, `Notification "${subject}" could not be sent`) // never block the action that triggered it
  }
}

export type Kind = 'review' | 'security' | 'inbox' | 'deadline' | 'account' | 'system'

const kindOf = (subject: string): Kind => {
  if (/review|changes requested|published|offline/i.test(subject)) return 'review'
  if (/message|subscriber/i.test(subject)) return 'inbox'
  if (/locked|two-factor|sign-in|security|export/i.test(subject)) return 'security'
  if (/password|access level|role|account/i.test(subject)) return 'account'
  if (/closing|deadline/i.test(subject)) return 'deadline'
  return 'system'
}

/**
 * The bell inside the admin. Never throws: a notification must not undo or block the change that caused it.
 * `dedupeKey` makes repeated checks harmless: one person gets one notification per key.
 */
export async function notifyInApp(
  payload: Payload,
  recipients: { id: string | number }[],
  n: { kind?: Kind; title: string; body?: string; link?: string; dedupeKey?: string },
) {
  for (const r of recipients) {
    try {
      if (n.dedupeKey) {
        const seen = await payload.count({ collection: 'notifications', overrideAccess: true, where: { and: [{ recipient: { equals: r.id } }, { dedupeKey: { equals: n.dedupeKey } }] } })
        if (seen.totalDocs) continue
      }
      await payload.create({ collection: 'notifications', overrideAccess: true, data: { recipient: r.id as number, kind: n.kind ?? 'system', title: n.title, body: n.body, link: n.link, dedupeKey: n.dedupeKey } })
    } catch (e) {
      payload.logger.warn({ err: e }, `In-app notification "${n.title}" could not be saved`)
    }
  }
}

export async function usersWithRoles(payload: Payload, roles: string[]) {
  const r = await payload.find({ collection: 'users', where: { role: { in: roles } }, limit: 100, depth: 0, overrideAccess: true, pagination: false })
  return r.docs as unknown as { id: string | number; email: string }[]
}

/** Fire and forget: a slow or broken mail server must never hold up or undo a change. */
export function notifyRoles(payload: Payload, roles: string[], subject: string, lines: string[], opts: { except?: string; path?: string; kind?: Kind } = {}) {
  void (async () => {
    const users = (await usersWithRoles(payload, roles)).filter((u) => u.email && u.email !== opts.except)
    await notifyInApp(payload, users, { kind: opts.kind ?? kindOf(subject), title: subject, body: lines[0], link: opts.path })
    await send(payload, users.map((u) => u.email), subject, lines, opts.path ? { href: `${SITE()}${opts.path}`, label: 'Open in admin' } : undefined)
  })().catch(() => {})
}

export function notifyUser(payload: Payload, email: string, subject: string, lines: string[], opts: { path?: string; kind?: Kind } = {}) {
  void (async () => {
    const r = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1, depth: 0, overrideAccess: true })
    if (r.docs[0]) await notifyInApp(payload, [r.docs[0] as { id: string | number }], { kind: opts.kind ?? kindOf(subject), title: subject, body: lines[0], link: opts.path })
    await send(payload, [email], subject, lines)
  })().catch(() => {})
}
