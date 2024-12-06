import '@/global.scss'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { createRoot } from 'react-dom/client'

import App from '@/App'

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
)
