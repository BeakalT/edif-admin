import { Governance as Page } from '@/site/pages/About'
import { CmsPage, cmsMetadata } from '@/site/components/CmsPage'

export const generateMetadata = () => cmsMetadata('/about/governance')
export default function Route() {
  return <CmsPage path="/about/governance"><Page /></CmsPage>
}
