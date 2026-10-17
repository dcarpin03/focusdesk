import { useEffect, useRef, useState } from 'react'
import type { Theme } from '../types'
import { THEMES } from '../utils/themes'
import type { useBackground } from '../hooks/useBackground'
import defaultBackground from '../assets/editorial/study-window.webp'
import './SettingsPanel.css'

type SettingsPanelProps = {
  background: ReturnType<typeof useBackground>
  triggerLabel?: string
  theme: Theme
  onThemeChange: (theme: Theme) => void
  error: string
}

export function SettingsPanel({ theme, onThemeChange, error, triggerLabel, background }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const closePanel = () => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  useEffect(() => {
    if (!isOpen) return
    closeRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !panelRef.current?.contains(event.target) && !triggerRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isOpen])

  return (
    <div className='settings'>
      <button
        type='button'
        className='settings-trigger'
        ref={triggerRef}
        aria-label={triggerLabel ? `${triggerLabel}: abrir ajustes` : 'Abrir ajustes'}
        aria-expanded={isOpen}
        aria-controls='settings-panel'
        onClick={() => isOpen ? closePanel() : setIsOpen(true)}
      >
        <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinejoin='round' aria-hidden='true'>
          <path d='M10 2h4l.6 2.8 2 .9 2.5-1.2 2 3.5-2 1.9.2 2.2 2.1 1.8-2 3.5-2.6-.9-1.9 1.1L14 22h-4l-.7-2.6-1.9-1.1-2.6.9-2-3.5L4.9 14l.2-2.2-2-1.9 2-3.5 2.5 1.2 2-.9L10 2Z' />
          <circle cx='12' cy='12' r='3' />
        </svg>
        {triggerLabel && <span>{triggerLabel}</span>}
      </button>
      <section className='settings-panel' id='settings-panel' aria-labelledby='settings-title' ref={panelRef} hidden={!isOpen}>
        <div className='settings-heading'>
          <h2 id='settings-title'>Ajustes</h2>
          <button type='button' className='settings-close' ref={closeRef} aria-label='Cerrar ajustes' onClick={closePanel}>×</button>
        </div>
        <fieldset className='theme-options'>
          <legend>Apariencia</legend>
          <h3 className='theme-options-title'>Tema de color</h3>
          <p>Personaliza los colores de FocusDesk.</p>
          {THEMES.map((option) => (
            <label className='theme-option' key={option.id} data-selected={theme === option.id}>
              <input type='radio' name='appearance-theme' value={option.id} checked={theme === option.id} onChange={() => onThemeChange(option.id)} />
              <span className='theme-name'>{option.name}</span>
              <span className='theme-status' aria-hidden='true'>{theme === option.id ? 'Activo' : ''}</span>
              <span className='theme-preview' data-theme-preview={option.id} aria-hidden='true'>
                <span className='theme-preview-surface'></span>
                <span className='theme-preview-accent'></span>
              </span>
            </label>
          ))}
        </fieldset>
        <fieldset className='background-settings'>
          <legend>Fondo ambiental</legend>
          <img src={background.url ?? defaultBackground} alt='Fondo ambiental actual' onError={({ currentTarget }) => { if (currentTarget.getAttribute('src') !== defaultBackground) currentTarget.src = defaultBackground }} />
          <p>JPG, PNG o WebP · Hasta 10 MB y 30 megapíxeles.</p>
          <div className='background-actions'>
            <button type='button' disabled={background.isPending} onClick={background.importImage}>Importar imagen</button>
            <button type='button' disabled={background.isPending} onClick={background.resetImage}>Restablecer fondo</button>
          </div>
          {background.isPending && <p role='status'>Cargando fondo…</p>}
          {background.error && <p className='section-error' role='alert'>{background.error}</p>}
        </fieldset>
        {error && <p className='section-error' role='alert'>{error}</p>}
      </section>
    </div>
  )
}
