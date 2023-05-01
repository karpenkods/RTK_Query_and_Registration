import { useTranslation } from 'react-i18next'

import { Layout, RTK } from '../components'

export function RTKPage() {
  const { t } = useTranslation()

  return (
    <Layout container withNavbar title={t('posts')} description={t('posts')}>
      <RTK />
    </Layout>
  )
}
