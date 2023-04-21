import { Layout, RTK } from '../components'

export function RTKPage() {
  return (
    <Layout
      container={true}
      withNavbar
      title="RTK_Query"
      description="Запросы с RTK_Query"
    >
      <RTK />
    </Layout>
  )
}
