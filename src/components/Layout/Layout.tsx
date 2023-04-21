import { FC, PropsWithChildren } from 'react'

import SEO from '../../common/SEO/SEO'
import { Navbar } from '../Navbar/Navbar'
import { ILayoutProps } from '../../common/models/layout'

import './layout.scss'

export const Layout: FC<PropsWithChildren<ILayoutProps>> = ({
  children,
  title,
  description,
  withNavbar,
  container,
}) => {
  return (
    <>
      <SEO title={title} description={description} type="article" />
      {container ? (
        <div className="layout">
          {withNavbar && <Navbar />}
          <main className="layout__container">{children}</main>
        </div>
      ) : (
        <main>{children}</main>
      )}
    </>
  )
}
