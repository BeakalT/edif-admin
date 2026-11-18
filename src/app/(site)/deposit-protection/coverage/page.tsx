import { Coverage as Page } from '@/site/pages/Protection'
import { CmsPage, cmsMetadata } from '@/site/components/CmsPage'

export const generateMetadata = () => cmsMetadata('/deposit-protection/coverage')
export default function Route() {
  return <CmsPage path="/deposit-protection/coverage"><Page /></CmsPage>
}
