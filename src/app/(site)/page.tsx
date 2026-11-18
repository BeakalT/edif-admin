import Home from '../../site/pages/Home'
import { SITE_URL, getCms } from '../../lib/cms'
import { CmsPage, cmsMetadata } from '../../site/components/CmsPage'

export const generateMetadata = () => cmsMetadata('/')

export default async function Page() {
  const { contact } = await getCms()
  const org = {
    '@context': 'https://schema.org', '@type': 'GovernmentOrganization', name: 'Ethiopian Deposit Insurance Fund', alternateName: 'EDIF', url: SITE_URL,
    logo: SITE_URL + '/images/logoB.svg', email: contact.email, telephone: contact.phones[0],
    address: { '@type': 'PostalAddress', streetAddress: contact.address[0], addressLocality: 'Addis Ababa', addressCountry: 'ET' },
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <CmsPage path="/"><Home /></CmsPage>
    </>
  )
}
