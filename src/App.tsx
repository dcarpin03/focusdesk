import './App.css'
import { useLayoutEffect, useRef } from 'react'
import type { Theme } from './types'
import { useFocusDesk } from './hooks/useFocusDesk'
import { getLayoutComponent } from './layouts/layoutConfig'
import type { AvailableLayoutId } from './utils/layouts'

function App({ initialTheme, initialLayout }: { initialTheme: Theme; initialLayout: AvailableLayoutId }) {
  const model = useFocusDesk(initialTheme, initialLayout)
  const previousLayout = useRef(model.layout)
  const Layout = getLayoutComponent(model.layout)

  useLayoutEffect(() => {
    if (previousLayout.current !== model.layout) {
      document.querySelector<HTMLButtonElement>('.settings-trigger')?.focus()
      previousLayout.current = model.layout
    }
  }, [model.layout])

  return <Layout model={model} />
}

export default App
