import { BrowserRouter } from 'react-router-dom'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './admin/auth/AuthProvider.jsx'
import { StoreProvider } from './store/StoreProvider.jsx'
import { ThemeProvider } from './theme/ThemeProvider.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <StoreProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </StoreProvider>
    </ThemeProvider>
  </StrictMode>,
)
