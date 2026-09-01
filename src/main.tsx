import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import App from './App.tsx'
import { LangProvider } from './i18n/i18n'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <LangProvider>
    <App />
    <Analytics />
  </LangProvider>,
)
