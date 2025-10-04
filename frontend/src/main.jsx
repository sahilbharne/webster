import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { AppProvider } from './context/AppContext.jsx'
import App from './App.jsx'
import './index.css'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkPubKey) {
  console.error('❌ VITE_CLERK_PUBLISHABLE_KEY is missing from environment variables')
  throw new Error('Missing Clerk Publishable Key. Please check your .env file.')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <AppProvider>
        <App />
      </AppProvider>
    </ClerkProvider>
  </React.StrictMode>,
)