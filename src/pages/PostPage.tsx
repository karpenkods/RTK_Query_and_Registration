import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Layout, PostCard } from '../components'

export function PostPage() {
  const [number, setNumber] = useState(0)
  const { t } = useTranslation()

  return (
    <Layout
      container
      withNavbar
      title={`${t('post')}${number === 0 ? '' : number}`}
      description={t('post')}
    >
      <PostCard getNumber={setNumber} />
    </Layout>
  )
}
