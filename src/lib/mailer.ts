import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

/**
 * Outgoing mail. In production set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and MAIL_FROM.
 * Without SMTP settings (local testing) each message is written to the ./outbox folder instead of being sent.
 */
let n = 0
const outbox = {
  name: 'outbox',
  version: '1',
  send(mail: any, cb: (err: Error | null, info?: any) => void) {
    try {
      const dir = path.resolve(process.cwd(), 'outbox')
      fs.mkdirSync(dir, { recursive: true })
      const d = mail.data
      fs.writeFileSync(path.join(dir, `${Date.now()}-${n++}.json`), JSON.stringify({ to: d.to, subject: d.subject, text: d.text, html: d.html }, null, 2), { mode: 0o600 })
      cb(null, { messageId: 'outbox', envelope: {}, accepted: [], rejected: [], pending: [], response: 'outbox' })
    } catch (e) {
      cb(e as Error)
    }
  },
}

export const emailAdapter = () => {
  const host = process.env.SMTP_HOST
  const transport = host
    ? nodemailer.createTransport({ host, port: Number(process.env.SMTP_PORT || 587), secure: Number(process.env.SMTP_PORT) === 465, requireTLS: Number(process.env.SMTP_PORT) !== 465 && process.env.SMTP_ALLOW_PLAIN !== 'true', auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined })
    : nodemailer.createTransport(outbox as any)
  return nodemailerAdapter({ defaultFromAddress: process.env.MAIL_FROM || 'no-reply@edif-cms.org', defaultFromName: 'EDIF Admin', transport })
}
