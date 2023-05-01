import React from 'react'
import ReactDOM from 'react-dom/client'
import { PersistGate } from 'redux-persist/integration/react'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'

import { Zoom } from '@mui/material'

import { persistor, store } from './common'
import { Snackbar } from './components'
import App from './App'
import './firebase'
import './i18n'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
const helmetContext = {}

root.render(
  <React.StrictMode>
    <HelmetProvider context={helmetContext}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SnackbarProvider hideIconVariant TransitionComponent={Zoom}>
            <BrowserRouter>
              <App />
              <Snackbar />
            </BrowserRouter>
          </SnackbarProvider>
        </PersistGate>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>,
)
