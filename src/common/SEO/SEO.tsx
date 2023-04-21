import { FC } from 'react'
import { Helmet } from 'react-helmet-async'

import { ISeoProps } from '../models'

const SEO: FC<ISeoProps> = (props) => {
  return (
    <Helmet>
      <title>QUERIES - {props.title}</title>
      <meta name="description" content={props.description} />
      <meta property="og:type" content={props.type} />
      <meta property="og:title" content={props.title} />
      <meta property="og:description" content={props.description} />
    </Helmet>
  )
}

export default SEO
