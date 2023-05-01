import { FC, Fragment, useEffect, useState } from 'react'
import { User, getAuth, onAuthStateChanged } from 'firebase/auth'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
  }, [auth, refresh])

  return (
    <Fragment>
      <Stack direction="column" alignItems="center">
        <Typography variant="h3" color="tomato" sx={{ marginBottom: '30px' }}>
          {t('titleHome')}
        </Typography>
        {loading ? (
          <CircularProgress
            color="success"
            style={{ width: '50px', height: '50px' }}
          />
        ) : user ? (
          <Fragment>
            <Typography
              variant="h6"
              color="blueviolet"
              sx={{ margin: '0 20px' }}
            >
              {t('welcome')}{' '}
              <span style={{ color: 'green' }}>
                {user.displayName
                  ? `${user?.displayName}`
                  : `${t('anonymousUser')}`}
              </span>
            </Typography>
            <Typography variant="h6" color="primary">
              {t('descriptionHome_1')}
            </Typography>
            <Typography variant="h6" color="primary">
              {t('descriptionHome_2')}
            </Typography>
            {!user?.emailVerified && !close && !user.isAnonymous && (
              <EmailConfirmModal />
            )}
          </Fragment>
        ) : (
          <Fragment>
            <Typography
              variant="h6"
              color="blueviolet"
              sx={{ margin: '0 20px' }}
            >
              {t('descriptionHomeNotAuth_1')}
            </Typography>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              gap={'20px'}
              sx={{ width: '100%', marginTop: '10px' }}
            >
              <Link to={'/login'} style={linkStyle}>
                {t('descriptionHomeNotAuth_2')}
              </Link>
              <Typography variant="h6" color="blueviolet">
                {t('descriptionHomeNotAuth_3')}
              </Typography>
              <Link to={'/registration'} style={linkStyle}>
                {t('descriptionHomeNotAuth_4')}
              </Link>
            </Stack>
          </Fragment>
        )}
      </Stack>
    </Fragment>
  )
}
