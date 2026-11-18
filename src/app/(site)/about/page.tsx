import { AboutPage as Page } from '@/site/pages/About'
import { CmsPage, cmsMetadata } from '@/site/components/CmsPage'

export const generateMetadata = () => cmsMetadata('/about')
export default function Route() {
  return <CmsPage path="/about"><Page /></CmsPage>
}
