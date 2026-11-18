'use client'
import { useActionState, useState } from 'react'
import { contactAction, newsletterAction, subscribeAction, type FormState } from '../../app/(site)/actions'
import { Arrow } from './ui'

const init: FormState = {}

export function ContactForm({ email }: { email: string }) {
  const [state, act, pending] = useActionState(contactAction, init)
  const [t] = useState(() => Date.now())
  if (state.ok) return <div className="cform"><h2 className="h3">Thank you</h2><p className="sent" role="status">Your message has reached the Fund. We will reply to the email address you gave. For anything urgent, call us.</p></div>
  return (
    <form className="cform" action={act}>
      <h2 className="h3">Send us a message</h2>
      <p className="csub2">We read every message. Please do not include account numbers or passwords.</p>
      <div className="f2">
        <label><span>Name</span><input className="field" name="name" required maxLength={120} autoComplete="name" /></label>
        <label><span>Email</span><input className="field" name="email" type="email" required maxLength={200} autoComplete="email" /></label>
      </div>
      <label><span>Topic</span>
        <select className="field" name="topic" defaultValue="My deposits">
          <option>My deposits</option><option>Membership and premiums</option><option>Media and publications</option><option>Feedback on this website</option><option>Something else</option>
        </select>
      </label>
      <label><span>Message</span><textarea className="field" name="message" rows={6} required minLength={10} maxLength={4000} /></label>
      <div className="hp" aria-hidden="true"><label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <input type="hidden" name="t" value={t} />
      <button className="btn btn--navy" type="submit" disabled={pending}>{pending ? 'Sending…' : 'Send message'} <Arrow /></button>
      {state.error && <p className="sent" role="alert">{state.error} You can also write to <a href={'mailto:' + email}>{email}</a>.</p>}
    </form>
  )
}

export function NewsletterForm() {
  const [state, act, pending] = useActionState(subscribeAction, init)
  if (state.ok) return <p className="nl-done" role="status">Almost done. If that address is valid, a confirmation email is on its way.</p>
  return (
    <form className="nl" action={act}>
      <label className="sr" htmlFor="nl-email">Email address</label>
      <input id="nl-email" className="field" name="email" type="email" required maxLength={200} placeholder="Your email address" autoComplete="email" />
      <div className="hp" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
      <button className="btn btn--gold" type="submit" disabled={pending}>{pending ? '…' : 'Subscribe'}</button>
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  )
}

export function NewsletterConfirm({ action, token }: { action: 'confirm' | 'unsubscribe'; token: string }) {
  const [state, act, pending] = useActionState(newsletterAction, init)
  if (state.ok) return <p role="status">{action === 'confirm' ? 'Thank you. Your subscription is confirmed.' : 'You have been unsubscribed. You will not receive further emails.'}</p>
  return (
    <form action={act}>
      <input type="hidden" name="token" value={token} /><input type="hidden" name="action" value={action} />
      <p>{action === 'confirm' ? 'Press the button to confirm that you want email updates from the Fund.' : 'Press the button to stop receiving email updates.'}</p>
      <button className="btn btn--navy" type="submit" disabled={pending}>{action === 'confirm' ? 'Confirm subscription' : 'Unsubscribe'}</button>
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  )
}
