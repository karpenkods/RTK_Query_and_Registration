import { useTranslation } from 'react-i18next'

import { Layout, Post } from '../components'
import { useAppSelector } from '../common'

export function PostPage() {
  const { t } = useTranslation()
  const postId = useAppSelector((store) => store.posts.postId)

  return (
    <Layout
      container
      withNavbar
      title={`${t('post')}${postId}`}
      description={t('post')}
    >
      <Post />
    </Layout>
  )
}
