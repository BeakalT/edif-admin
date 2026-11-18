import React from 'react'

/** Shown on the sign-in screen. Follows light and dark. */
export const Logo: React.FC = () => (
  <div className="edif-login-brand">
    <img src="/images/logoB.svg" alt="" width={72} height={74} />
    <div>
      <div className="edif-login-name">Ethiopian Deposit Insurance Fund</div>
      <div className="edif-login-sub">Website administration</div>
    </div>
  </div>
)
