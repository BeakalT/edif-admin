import { ProtectionOverview as Page } from '@/site/pages/Protection'
import { CmsPage, cmsMetadata } from '@/site/components/CmsPage'

export const generateMetadata = () => cmsMetadata('/deposit-protection')
export default function Route() {
  return <CmsPage path="/deposit-protection"><Page /></CmsPage>
}
