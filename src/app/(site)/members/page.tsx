import Page from '@/site/pages/Members'
import { CmsPage, cmsMetadata } from '@/site/components/CmsPage'

export const generateMetadata = () => cmsMetadata('/members')
export default function Route() {
  return <CmsPage path="/members"><Page /></CmsPage>
}
