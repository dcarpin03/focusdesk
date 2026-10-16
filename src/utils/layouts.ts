import type { LayoutId } from '../layouts/types'

export type AvailableLayoutId = Extract<LayoutId, 'editorial' | 'glass'>

export const DEFAULT_LAYOUT: AvailableLayoutId = 'editorial'

export const AVAILABLE_LAYOUTS: { id: AvailableLayoutId; name: string }[] = [
  { id: 'editorial', name: 'Editorial Premium' },
  { id: 'glass', name: 'Glass Nocturno' }
]

export function isAvailableLayout(value: unknown): value is AvailableLayoutId {
  return AVAILABLE_LAYOUTS.some((layout) => layout.id === value)
}
