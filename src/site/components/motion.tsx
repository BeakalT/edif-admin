'use client'
import { useEffect, useRef, useState, type PointerEvent, type RefObject } from 'react'

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Adds `true` once the element has scrolled into view (fires once). */
export function useInView<T extends Element>(threshold = 0.2): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- motion state starts after hydration; reduced-motion users get the final value
    if (reduced() || !('IntersectionObserver' in window)) { setInView(true); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect() }
    }, { threshold, rootMargin: '0px 0px -6% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, inView]
}

/** Counts from 0 to `to` when `run` turns true. Shows the final value without motion. */
export function CountUp({ to, run, duration = 1600 }: { to: number; run: boolean; duration?: number }) {
  const [v, setV] = useState(() => (reduced() ? to : 0))
  useEffect(() => {
    if (!run) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- motion state starts after hydration; reduced-motion users get the final value
    if (reduced()) { setV(to); return }
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration)
      const e = 1 - Math.pow(1 - p, 4)
      setV(Math.round(to * e))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, to, duration])
  return <span className="num count" role="img" aria-label={to.toLocaleString('en-US')}><span aria-hidden="true">{v.toLocaleString('en-US')}</span></span>
}

/** Pointer-follow glow: sets --mx / --my on the element. */
export const spotlight = (e: PointerEvent<HTMLElement>) => {
  if (e.pointerType !== 'mouse') return
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

/** Animates smoothly between number values. Screen readers get the final value only. */
export function Tween({ value, duration = 700 }: { value: number; duration?: number }) {
  const [v, setV] = useState(value)
  const from = useRef(value)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- motion state starts after hydration; reduced-motion users get the final value
    if (reduced()) { setV(value); from.current = value; return }
    const a = from.current
    const t0 = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration)
      const cur = a + (value - a) * (1 - Math.pow(1 - p, 3))
      from.current = cur
      setV(cur)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])
  return <><span className="sr">{Math.round(value).toLocaleString('en-US')}</span><span aria-hidden="true">{Math.round(v).toLocaleString('en-US')}</span></>
}
