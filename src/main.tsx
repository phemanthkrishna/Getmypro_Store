import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-center"
      richColors
      toastOptions={{
        style: {
          fontFamily: 'Nunito, sans-serif',
          fontWeight: '700',
          fontSize: '16px',
        },
      }}
    />
  </StrictMode>,
)
