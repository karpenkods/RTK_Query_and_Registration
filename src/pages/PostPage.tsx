import { Layout, Post } from '../components'

export function PostPage() {
  return (
    <Layout
      container={true}
      withNavbar
      title="Post"
      description="Страница поста"
    >
      <Post />
    </Layout>
  )
}
