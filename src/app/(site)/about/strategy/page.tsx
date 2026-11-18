import { Strategy as Page } from '@/site/pages/About'
import { CmsPage, cmsMetadata } from '@/site/components/CmsPage'

export const generateMetadata = () => cmsMetadata('/about/strategy')
export default function Route() {
  return <CmsPage path="/about/strategy"><Page /></CmsPage>
}
