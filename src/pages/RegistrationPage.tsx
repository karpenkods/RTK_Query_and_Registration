import { useTranslation } from 'react-i18next'

import { Layout, Registration } from '../components'

export function RegistrationPage() {
  const { t } = useTranslation()

  return (
    <Layout container title={t('logIn')} description="">
      <Registration />
    </Layout>
  )
}
