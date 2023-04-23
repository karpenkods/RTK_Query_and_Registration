import { FC, PropsWithChildren } from 'react'

import { Navbar } from '../Navbar'
import { ILayoutProps, SEO } from '../../common'

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
