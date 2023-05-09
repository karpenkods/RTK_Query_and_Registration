import { useTranslation } from 'react-i18next'

import { Layout, Posts } from '../components'

export function PostsPage() {
  const { t } = useTranslation()

  return (
    <Layout container withNavbar title={t('posts')} description={t('posts')}>
      <Posts />
    </Layout>
  )
}
