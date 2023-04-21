import { Home, Layout } from '../components'

export function HomePage() {
  return (
    <Layout
      container={true}
      withNavbar
      title="Home"
      description="Домашняя страница"
    >
      <Home />
    </Layout>
  )
}
