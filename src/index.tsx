import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'

import { Zoom } from '@mui/material'

import { store } from './common/redux'
import { Snackbar } from './components'
import App from './App'
import './firebase'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
const helmetContext = {}

root.render(
  <React.StrictMode>
    <HelmetProvider context={helmetContext}>
      <Provider store={store}>
        <SnackbarProvider hideIconVariant TransitionComponent={Zoom}>
          <BrowserRouter>
            <App />
            <Snackbar />
          </BrowserRouter>
        </SnackbarProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>,
)
