import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { DEFAULT_THEME, isTheme } from './utils/themes'
import './themes.css'
import './index.css'

async function initializeApp() {
  let initialTheme = DEFAULT_THEME
  try {
    const storedTheme = await window.focusDeskStorage.getTheme()
    if (isTheme(storedTheme)) initialTheme = storedTheme
  } catch (error) {
    console.error('Error al cargar el tema de FocusDesk:', error)
  }

  document.documentElement.dataset.theme = initialTheme
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App initialTheme={initialTheme} />
    </React.StrictMode>,
  )
}

initializeApp()
