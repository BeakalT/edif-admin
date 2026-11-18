import { Payout as Page } from '@/site/pages/Protection'
import { CmsPage, cmsMetadata } from '@/site/components/CmsPage'

export const generateMetadata = () => cmsMetadata('/deposit-protection/payout')
export default function Route() {
  return <CmsPage path="/deposit-protection/payout"><Page /></CmsPage>
}
