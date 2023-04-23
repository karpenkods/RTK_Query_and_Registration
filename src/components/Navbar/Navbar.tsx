import { FC } from 'react'
import { NavLink } from 'react-router-dom'

import { MenuUser } from '../MenuUser/MenuUser'
import { AvatarUser } from '../AvatarUser/AvatarUser'

import './navbar.scss'
import { useUser } from '../../common'

export const Navbar: FC = () => {
  const user = useUser()

  const pages = [
    {
      name: 'Главная',
      path: '/',
    },
    {
      name: 'RTK Query',
      path: '/rtk-query',
    },
  ]

  return (
    <nav className="nav">
      <div className="nav__container">
        <div className="nav__leftBlock">
          {user ? (
            pages.map((page) => (
              <NavLink
                to={page.path}
                key={page.name}
                className={({ isActive }) =>
                  isActive ? 'nav__link_active' : 'nav__link'
                }
              >
                {page.name}
              </NavLink>
            ))
          ) : (
            <NavLink to={'/'} className="nav__link_active">
              Главная
            </NavLink>
          )}
        </div>
        <h1 className="nav__heading">QUERIES</h1>
        <AvatarUser fontSize={'150%'} />
        <MenuUser />
      </div>
    </nav>
  )
}
