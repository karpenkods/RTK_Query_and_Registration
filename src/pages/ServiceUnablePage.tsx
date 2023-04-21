import { Layout, ServiceUnable } from '../components'

export function ServiceUnablePage() {
  return (
    <Layout container={false} title="Error" description="">
      <ServiceUnable />
    </Layout>
  )
}
