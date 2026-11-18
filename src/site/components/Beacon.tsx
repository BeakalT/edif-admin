'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function Beacon() {
  const path = usePathname()
  useEffect(() => {
    try { navigator.sendBeacon('/stats/hit', new Blob([JSON.stringify({ path })], { type: 'application/json' })) } catch { /* analytics must never break the page */ }
  }, [path])
  return null
}
