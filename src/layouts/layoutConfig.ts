import type { ComponentType } from 'react'
import { CurrentLayout } from './CurrentLayout'
import { EditorialLayout } from './EditorialLayout'
import { GlassLayout } from './GlassLayout'
import type { LayoutId, LayoutProps } from './types'

type LayoutDefinition = {
  name: string
  component?: ComponentType<LayoutProps>
}

// Planned designs use the existing interface until their presentation is implemented.
export const LAYOUTS: Record<LayoutId, LayoutDefinition> = {
  editorial: { name: 'Editorial Premium', component: EditorialLayout },
  glass: { name: 'Glass Nocturno', component: GlassLayout },
  minimal: { name: 'Minimalista' },
  workspace: { name: 'Workspace' },
  serenity: { name: 'Serenity' },
  neon: { name: 'Neon' }
}

export { DEFAULT_LAYOUT } from '../utils/layouts'

export function getLayoutComponent(layoutId: LayoutId): ComponentType<LayoutProps> {
  return LAYOUTS[layoutId].component ?? CurrentLayout
}
