/**
 * App.tsx — Root application component.
 *
 * Module 1: renders the application shell (TopBar) and the FoundationPage.
 * Routing will be added in later modules when multiple pages are needed.
 */

import { TopBar } from './components/TopBar'
import { FoundationPage } from './pages/FoundationPage'
import { useHealthCheck } from './hooks/useHealthCheck'

export default function App() {
  const apiStatus = useHealthCheck()

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: 'var(--color-surface-0)' }}
    >
      <TopBar apiStatus={apiStatus} />
      <FoundationPage apiStatus={apiStatus} />
    </div>
  )
}
