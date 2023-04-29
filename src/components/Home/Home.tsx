import { FC, Fragment, useEffect, useState } from 'react'
import { User, getAuth, onAuthStateChanged } from 'firebase/auth'
import { Link } from 'react-router-dom'

import { CircularProgress, Stack, Typography } from '@mui/material'

import { closeFunction, useAppSelector } from '../../common'
import { EmailConfirmModal } from '../Modals'

const linkStyle = {
  fontSize: '24px',
  textDecoration: 'none',
  color: 'blue',
  transition: '0.3s',
  '&:hover': {
    color: 'tomato',
  },
}

export const Home: FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const close = closeFunction(user ?? null)
  const auth = getAuth()
  const refresh = useAppSelector((store) => store.menu.refresh)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
  }, [auth, refresh])

  return (
    <Stack direction="column" alignItems="center">
      <Typography variant="h1" color="tomato" sx={{ marginBottom: '30px' }}>
        Запросы с RTK Query
      </Typography>
      {loading ? (
        <CircularProgress
          color="success"
          style={{ width: '50px', height: '50px' }}
        />
      ) : user ? (
        <Fragment>
          <Typography variant="h6" color="blueviolet" sx={{ margin: '0 20px' }}>
            Добро пожаловать,{' '}
            <span style={{ color: 'green' }}>
              {user.displayName
                ? `${user?.displayName}`
                : 'Анонимный пользователь'}
            </span>
          </Typography>
          {!user?.emailVerified && !close && !user.isAnonymous && (
            <EmailConfirmModal />
          )}
        </Fragment>
      ) : (
        <Fragment>
          <Typography variant="h6" color="blueviolet" sx={{ margin: '0 20px' }}>
            Чтобы перейти к странице с постами
          </Typography>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap={'20px'}
            sx={{ width: '100%', marginTop: '10px' }}
          >
            <Link to={'/login'} style={linkStyle}>
              войдите
            </Link>
            <Typography variant="h6" color="blueviolet">
              или
            </Typography>
            <Link to={'/registration'} style={linkStyle}>
              зарегистрируйтесь
            </Link>
          </Stack>
        </Fragment>
      )}
    </Stack>
  )
}
