import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './index.css'
import { QueryProvider } from './config/queryClient.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryProvider>
        <App />
      </QueryProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
