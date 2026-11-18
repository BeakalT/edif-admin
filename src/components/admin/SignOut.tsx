'use client'
import React from 'react'
import { useConfig } from '@payloadcms/ui'

/** A visible "Sign out" in the header. Payload's own sign-out is only a small icon at the very bottom of the sidebar, below the fold on most screens. */
export const SignOut: React.FC = () => {
  const { config } = useConfig()
  return (
    <a className="edif-signout" href={`${config.routes.admin}/logout`}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
      <span>Sign out</span>
    </a>
  )
}
