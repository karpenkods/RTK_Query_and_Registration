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

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="rtk-query" element={<RTKPage />} />
      <Route path="post/:id" element={<PostPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="registration" element={<RegistrationPage />} />
      <Route path={'*' || '404'} element={<ServiceUnablePage />} />
    </Routes>
  )
}

export default App
