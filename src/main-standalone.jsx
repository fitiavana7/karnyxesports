import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import AppShell from '@/AppShell'
import './styles/tokens.css'
import './styles/animations.css'
import './styles/components.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AppShell />
    </HashRouter>
  </StrictMode>
)
