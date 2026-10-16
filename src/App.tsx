import './App.css'
import type { Theme } from './types'
import { useFocusDesk } from './hooks/useFocusDesk'
import { DEFAULT_LAYOUT, getLayoutComponent } from './layouts/layoutConfig'

function App({ initialTheme }: { initialTheme: Theme }) {
  const model = useFocusDesk(initialTheme)
  const Layout = getLayoutComponent(DEFAULT_LAYOUT)

  return <Layout model={model} />
}

export default App
