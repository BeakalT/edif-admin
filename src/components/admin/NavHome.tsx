/* eslint-disable @next/next/no-img-element -- a small static SVG inside the admin; next/image adds nothing here */
'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import { useConfig } from '@payloadcms/ui'

/** Top of the sidebar: who this is, and a way back to the dashboard. */
export const NavHome: React.FC = () => {
  const path = usePathname()
  const ADMIN_ROUTE = useConfig().config.routes.admin
  const home = path === ADMIN_ROUTE || path === ADMIN_ROUTE + '/'
  return (
    <div className="edif-navhome">
      <a href={ADMIN_ROUTE} className="edif-navhome__brand" aria-label="EDIF website administration, dashboard">
        <img className="edif-navhome__mark" src="/images/logoB.svg" alt="" width={30} height={31} />
        <span><strong>EDIF</strong><small>Website admin</small></span>
      </a>
      <a href={ADMIN_ROUTE} className={'nav__link edif-navhome__link' + (home ? ' active' : '')} aria-current={home ? 'page' : undefined}>Dashboard</a>
    </div>
  )
}
