import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AnimalProvider } from './context/AnimalContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AnimalProvider>
      <App />
    </AnimalProvider>
  </React.StrictMode>,
)

// In development Vite serves live modules, so only enable offline caching in production.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('No se pudo registrar el service worker de Clowder:', error)
    })
  })
}
