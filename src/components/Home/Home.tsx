import { FC, Fragment, useEffect, useState } from 'react'
import { User, getAuth, onAuthStateChanged } from 'firebase/auth'
import { useTranslation } from 'react-i18next'

import { CircularProgress, Link, Stack, Typography } from '@mui/material'

import {
  closeFunction,
  pathNameReducer,
  useAppDispatch,
  useAppSelector,
} from '../../common'
import { EmailConfirmModal } from '../Modals'
import { useNavigate } from 'react-router-dom'

export const Home: FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const close = closeFunction(user ?? null)
  const auth = getAuth()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
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
        <Typography
          variant="h3"
          color="tomato"
          sx={{
            marginBottom: '30px',
            fontFamily: 'marckScript !important',
            fontSize: '72px',
            fontWeight: 500,
          }}
        >
          {t('titleHome')}
        </Typography>
        {loading ? (
          <CircularProgress
            color="success"
            style={{ width: '50px', height: '50px' }}
          />
        ) : user ? (
          <Fragment>
            <Typography variant="h5" sx={{ margin: '0 20px 20px 20px' }}>
              {t('welcome')}{' '}
              <span style={{ color: 'tomato', fontSize: '24px' }}>
                {user.displayName
                  ? `${user?.displayName}`
                  : `${t('anonymousUser')}`}
              </span>
            </Typography>
            <Typography variant="h5">{t('descriptionHome_1')}</Typography>
            <Typography variant="h5">{t('descriptionHome_2')}</Typography>
            <Link
              href={'/posts'}
              underline="hover"
              sx={{
                marginTop: '20px',
                color: 'tomato',
                fontSize: '22px',
              }}
            >
              {t('buttonPosts')}
            </Link>
            {!user?.emailVerified && !close && !user.isAnonymous && (
              <EmailConfirmModal />
            )}
          </Fragment>
        ) : (
          <Fragment>
            <Typography variant="h5" sx={{ margin: '0 20px' }}>
              {t('descriptionHomeNotAuth_1')}
            </Typography>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              gap={'20px'}
              sx={{ width: '100%', marginTop: '10px' }}
            >
              <Link
                component="button"
                onClick={() => {
                  navigate('/login'), dispatch(pathNameReducer('/'))
                }}
                underline="hover"
                sx={{ fontSize: '24px', color: 'tomato' }}
              >
                {t('descriptionHomeNotAuth_2')}
              </Link>
              <Typography variant="h5">
                {t('descriptionHomeNotAuth_3')}
              </Typography>
              <Link
                component="button"
                onClick={() => {
                  navigate('/registration'), dispatch(pathNameReducer('/'))
                }}
                underline="hover"
                sx={{ fontSize: '24px', color: 'tomato' }}
              >
                {t('descriptionHomeNotAuth_4')}
              </Link>
            </Stack>
          </Fragment>
        )}
      </Stack>
    </Fragment>
  )
}
