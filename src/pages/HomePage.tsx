import { useTranslation } from 'react-i18next'

import { Home, Layout } from '../components'

export function HomePage() {
  const { t } = useTranslation()

  return (
    <Layout
      container
      withNavbar
      title={t('homePage')}
      description={t('homePage')}
    >
      <Home />
    </Layout>
  )
}
