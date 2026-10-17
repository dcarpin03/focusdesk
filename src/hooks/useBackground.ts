import { useEffect, useState } from 'react'
import type { BackgroundResult } from '../types'

export function useBackground() {
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [isPending, setIsPending] = useState(true)

  useEffect(() => {
    let cancelled = false
    window.focusDeskStorage.getBackground().then((result) => {
      if (!cancelled) { setUrl(result.url); setError(result.error ?? '') }
    }).catch(() => {
      if (!cancelled) setError('No se pudo cargar el fondo. Se utiliza el predeterminado.')
    }).finally(() => { if (!cancelled) setIsPending(false) })
    return () => { cancelled = true }
  }, [])

  const update = async (operation: () => Promise<BackgroundResult>) => {
    if (isPending) return
    setIsPending(true)
    setError('')
    try {
      const result = await operation()
      setUrl(result.url)
      setError(result.error ?? '')
    } catch { setError('No se pudo cambiar el fondo. Inténtalo de nuevo.') }
    finally { setIsPending(false) }
  }

  return { url, error, isPending, importImage: () => update(window.focusDeskStorage.importBackground), resetImage: () => update(window.focusDeskStorage.resetBackground) }
}
