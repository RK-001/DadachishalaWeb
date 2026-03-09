import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './index.css'
import { QueryProvider } from './config/queryClient.jsx'
import cacheService from './services/cacheService.js'

// Clear any stale localStorage cache on every fresh page load (hard refresh).
// This ensures users always see up-to-date data from Firebase after a refresh.
cacheService.clearAll()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryProvider>
        <App />
      </QueryProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
