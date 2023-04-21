import { FC } from 'react'
import { Link } from 'react-router-dom'

import { useUser } from '../../common/hooks'
import { EmailModal } from '../EmailModal/EmailModal'

import './home.scss'

export const Home: FC = () => {
  const user = useUser()
  const userGitHub = user?.providerData.length
    ? user?.providerData[0].providerId.includes('github')
    : true

  return (
    <div className="home">
      <h2 className="home__title">Запросы с RTK Query</h2>
      {user ? (
        <>
          <p className="home__description">
            Добро пожаловать,{' '}
            <span style={{ color: 'green' }}>
              {user.displayName
                ? `${user?.displayName}`
                : 'Анонимный пользователь'}
            </span>
          </p>
          {!user?.emailVerified && !userGitHub && <EmailModal />}
        </>
      ) : (
        <>
          <h3 className="home__description">
            Чтобы перейти к странице с постами
          </h3>
          <div className="home__textBlock">
            <Link className="home__link" to={'/login'}>
              войдите
            </Link>
            <h3 className="home__description">или</h3>
            <Link className="home__link" to={'/register'}>
              зарегистрируйтесь
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
