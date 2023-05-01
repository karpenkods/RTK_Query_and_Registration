import { Suspense, useMemo } from 'react'
import { Route, Routes } from 'react-router-dom'

import {
  HomePage,
  LoginPage,
  PostPage,
  RTKPage,
  RegistrationPage,
  ServiceUnablePage,
} from './pages'
import './index.scss'
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from '@mui/material'
import { themeReducer, useAppDispatch, useAppSelector } from './common'

function App() {
  const dispatch = useAppDispatch()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const themePersist = useAppSelector((store) => store.theme.theme)

  if (!themePersist.length) {
    dispatch(themeReducer(prefersDarkMode ? 'dark' : 'light'))
  }

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themePersist === 'dark' ? 'dark' : 'light',
        },
      }),
    [themePersist],
  )

  return (
    <Suspense>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="rtk-query" element={<RTKPage />} />
          <Route path="post/:id" element={<PostPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="registration" element={<RegistrationPage />} />
          <Route path={'*' || '404'} element={<ServiceUnablePage />} />
        </Routes>
      </ThemeProvider>
    </Suspense>
  )
}

export default App
