import Page from '@/site/pages/Institutions'
import { CmsPage, cmsMetadata } from '@/site/components/CmsPage'

export const generateMetadata = () => cmsMetadata('/members/institutions')
export default function Route() {
  return <CmsPage path="/members/institutions"><Page /></CmsPage>
}
