import { useTranslation } from 'react-i18next'

import { Layout, Login } from '../components'

export function LoginPage() {
  const { t } = useTranslation()

  return (
    <Layout container title={t('signIn')} description="">
      <Login />
    </Layout>
  )
}
