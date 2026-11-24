/* eslint-disable @next/next/no-img-element -- a small static SVG inside the admin; next/image adds nothing here */
'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import { useAuth, useConfig } from '@payloadcms/ui'

/** Top of the sidebar: who this is, and a way back to the dashboard. */
export const NavHome: React.FC = () => {
  const path = usePathname()
  const ADMIN_ROUTE = useConfig().config.routes.admin
  const { user } = useAuth() as { user?: { name?: string; email?: string; role?: string } | null }
  const label = (user?.name || user?.email || '').trim()
  const initials = label.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('') || 'E'
  const home = path === ADMIN_ROUTE || path === ADMIN_ROUTE + '/'
  return (
    <div className="edif-navhome">
      <a href={ADMIN_ROUTE} className="edif-navhome__brand" aria-label="EDIF website administration, dashboard">
        <img className="edif-navhome__mark" src="/images/logoB.svg" alt="" width={30} height={31} />
        <span><strong>EDIF</strong><small>Website admin</small></span>
      </a>
      {user && (
        <a href={`${ADMIN_ROUTE}/account`} className="edif-navhome__me" aria-label={`Your account: ${label}`}>
          <span className="edif-navhome__avatar" aria-hidden="true">{initials}</span>
          <span><strong>{user.name || user.email}</strong>{user.name && user.email ? <small>{user.email}</small> : null}{user.role ? <em>{String(user.role).replace(/-/g, ' ')}</em> : null}</span>
        </a>
      )}
      <a href={ADMIN_ROUTE} className={'nav__link edif-navhome__link' + (home ? ' active' : '')} aria-current={home ? 'page' : undefined}>Dashboard</a>
    </div>
  )
}
