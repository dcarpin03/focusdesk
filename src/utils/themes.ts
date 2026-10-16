import type { Theme } from '../types'

export const DEFAULT_THEME: Theme = 'classic'

export const THEMES = [
  { id: 'classic', name: 'Clásico' },
  { id: 'dark', name: 'Oscuro' },
  { id: 'blue', name: 'Azul' },
  { id: 'green', name: 'Verde' }
] as const

export const isTheme = (value: unknown): value is Theme =>
  THEMES.some((theme) => theme.id === value)
