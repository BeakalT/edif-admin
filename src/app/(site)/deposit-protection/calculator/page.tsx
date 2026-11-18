import { CalculatorPage as Page } from '@/site/pages/Protection'
import { CmsPage, cmsMetadata } from '@/site/components/CmsPage'

export const generateMetadata = () => cmsMetadata('/deposit-protection/calculator')
export default function Route() {
  return <CmsPage path="/deposit-protection/calculator"><Page /></CmsPage>
}
