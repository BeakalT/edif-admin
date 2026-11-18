import { Organization as Page } from '@/site/pages/About'
import { CmsPage, cmsMetadata } from '@/site/components/CmsPage'

export const generateMetadata = () => cmsMetadata('/about/organization')
export default function Route() {
  return <CmsPage path="/about/organization"><Page /></CmsPage>
}
