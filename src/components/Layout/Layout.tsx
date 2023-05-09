import { FC, PropsWithChildren } from 'react'

import { Navbar } from '../Navbar'
import { ILayoutProps, SEO, useAppSelector } from '../../common'
import dark from '../../assets/dark.png'
import light from '../../assets/light.png'

import './layout.scss'

export const Layout: FC<PropsWithChildren<ILayoutProps>> = ({
  children,
  title,
  description,
  withNavbar,
  container,
}) => {
  const darkTheme = useAppSelector((store) => store.theme.theme) === 'dark'

  return (
    <>
      <SEO title={title} description={description} type="article" />
      {container ? (
        <div
          className="layout"
          style={{
            backgroundImage: `url(${darkTheme ? dark : light})`,
            backgroundSize: 'cover',
          }}
        >
          {withNavbar && <Navbar />}
          <main className="layout__container">{children}</main>
        </div>
      ) : (
        <main>{children}</main>
      )}
    </>
  )
}
