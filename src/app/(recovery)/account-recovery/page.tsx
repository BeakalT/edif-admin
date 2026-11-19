import { ADMIN_ROUTE } from '@/lib/adminRoute'
import RecoveryForm from './RecoveryForm'

export const dynamic = 'force-dynamic'

export default function AccountRecoveryPage() {
  return (
    <>
      <h1 style={{ fontSize: 24, margin: '0 0 8px' }}>Get back into the admin without your phone</h1>
      <p style={{ margin: '0 0 24px', lineHeight: 1.5 }}>
        Use one of the recovery codes you saved when you set up your account. Each code works once. Your authenticator is removed, and next time you sign in you scan a new QR code with your new phone.
      </p>
      <RecoveryForm loginHref={`${ADMIN_ROUTE}/login`} />
    </>
  )
}
