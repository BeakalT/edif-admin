'use client'
import { useEffect, useSyncExternalStore } from 'react'
import { Toaster, toast } from 'sonner'
import { useLocation } from '../router'

const MQ = '(max-width: 800px)'
const subscribe = (cb: () => void) => { const m = window.matchMedia(MQ); m.addEventListener('change', cb); return () => m.removeEventListener('change', cb) }
const useNarrow = () => useSyncExternalStore(subscribe, () => window.matchMedia(MQ).matches, () => false)

/** Quiet navy-and-gold toasts, top-right on desktop and top-center on phones, tucked under the sticky header so they never sit on the calculator result or a section heading. Dismissible, never trap focus, never the only place a message appears. */
export function SiteToaster() {
  const narrow = useNarrow()
  return (
    <Toaster position={narrow ? 'top-center' : 'top-right'} closeButton visibleToasts={2}
      offset={{ top: 108, right: 24 }} mobileOffset={{ top: 84, left: 16, right: 16 }}
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
