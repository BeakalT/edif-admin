'use client'
/** Small compatibility layer so the page components keep their familiar Link/NavLink while running on Next.js routing. */
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentProps } from 'react'

type LinkProps = Omit<ComponentProps<'a'>, 'href'> & { to: string }

export function Link({ to, ...rest }: LinkProps) {
  return <NextLink href={to} {...(rest as any)} />
}

export function NavLink({ to, end, className, ...rest }: LinkProps & { end?: boolean }) {
  const pathname = usePathname() || '/'
  const active = end || to === '/' ? pathname === to : pathname === to || pathname.startsWith(to + '/')
  return <NextLink href={to} className={[className, active ? 'active' : ''].filter(Boolean).join(' ') || undefined} aria-current={active ? 'page' : undefined} {...(rest as any)} />
}

export const useLocation = () => ({ pathname: usePathname() || '/', hash: '' })
