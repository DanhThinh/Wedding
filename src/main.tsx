import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { prepareGuestSession } from './lib/inviteSession'

// Capture outside StrictMode so personalization also works when storage is blocked.
const guest = prepareGuestSession()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App guest={guest} />
  </StrictMode>,
)
