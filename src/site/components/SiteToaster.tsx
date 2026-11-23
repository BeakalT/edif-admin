'use client'
import { useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import { useLocation } from '../router'

/** Quiet navy-and-gold toasts. Dismissible, never trap focus, and never the only place a message appears. */
export function SiteToaster() {
  return (
    <Toaster position="bottom-center" closeButton offset={20} visibleToasts={3}
      toastOptions={{ classNames: { toast: 'st', title: 'st-title', description: 'st-desc', closeButton: 'st-close', success: 'st-ok' } }} />
  )
}

/** Shows the payout scam warning once per browser session, the first time someone opens the payout page. */
export function PayoutScamWarning() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (!/^\/deposit-protection\/payout\/?$/.test(pathname)) return
    try { if (sessionStorage.getItem('edif-scam-note')) return } catch { /* storage unavailable: still show it once per page view */ }
    const t = setTimeout(() => {
      try { sessionStorage.setItem('edif-scam-note', '1') } catch { /* ignore */ }
      toast('A word of caution', {
        description: 'The Fund will never ask for your password or PIN. If someone claiming to be EDIF asks for your bank details, hang up and call the Fund on its published number.',
        duration: 14000,
      })
    }, 1400)
    return () => clearTimeout(t)
  }, [pathname])
  return null
}
