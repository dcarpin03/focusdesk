import type { FocusDeskModel } from '../hooks/useFocusDesk'

export type LayoutId =
  | 'editorial'
  | 'glass'
  | 'minimal'
  | 'workspace'
  | 'serenity'
  | 'neon'

export type LayoutProps = {
  model: FocusDeskModel
}
