import './App.css'
import type { Theme } from './types'
import { useFocusDesk } from './hooks/useFocusDesk'
import { EditorialLayout } from './layouts/EditorialLayout'

function App({ initialTheme }: { initialTheme: Theme }) {
  const model = useFocusDesk(initialTheme)
  return <EditorialLayout model={model} />
}

export default App
