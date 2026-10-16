import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { DEFAULT_THEME, isTheme } from './utils/themes'
import { DEFAULT_LAYOUT, isAvailableLayout } from './utils/layouts'
import './themes.css'
import './index.css'

async function initializeApp() {
  let initialTheme = DEFAULT_THEME
  let initialLayout = DEFAULT_LAYOUT
  try {
    const storedTheme = await window.focusDeskStorage.getTheme()
    if (isTheme(storedTheme)) initialTheme = storedTheme
  } catch (error) {
    console.error('Error al cargar el tema de FocusDesk:', error)
  }

  document.documentElement.dataset.theme = initialTheme
  try {
    const storedLayout = await window.focusDeskStorage.getLayout()
    if (isAvailableLayout(storedLayout)) initialLayout = storedLayout
  } catch (error) {
    console.error('Error al cargar el diseño de FocusDesk:', error)
  }
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App initialTheme={initialTheme} initialLayout={initialLayout} />
    </React.StrictMode>,
  )
}

initializeApp()
