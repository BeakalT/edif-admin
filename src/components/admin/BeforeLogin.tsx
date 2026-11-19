import Link from 'next/link'
import React from 'react'

/** A short plain-words note above the sign-in form. */
export default function BeforeLogin() {
  return (
    <p className="edif-login-note">
      Sign in with your password, then enter the 6-digit code from your authenticator app. Sessions end after a period of inactivity.
      {' '}Lost or changed your phone? <Link href="/account-recovery" prefetch={false}>Use a recovery code</Link>.
    </p>
  )
}
