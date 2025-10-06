// App.jsx - REMOVE ClerkProvider from here
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'

// Pages
import Landing from './pages/Landing/Landing'
import Discover from './pages/Discover/Discover'
import Dashboard from './pages/Dashboard/Dashboard'
import Profile from './pages/Profile/Profile'
import Upload from './pages/Upload/Upload'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import Collections from './pages/Collections/Collections'
import CollectionDetail from './pages/CollectionDetail/CollectionDetail'
import CreateCollection from './pages/CreateCollection/CreateCollection'
import EditCollection from './pages/EditCollection/EditCollection'

// Components
import Header from './components/Header/Header'

// Styles
import './App.css'

function App() {
  return (
    // REMOVED ClerkProvider from here
    <Router>
      <div className="App">
        {/* Signed In Users */}
        <SignedIn>
          <Header />
          <main className="min-h-screen bg-black pt-16">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/collections/create" element={<CreateCollection />} />
              <Route path="/collections/:id" element={<CollectionDetail />} />
              <Route path="/collections/:id/edit" element={<EditCollection />} />
              {/* Fallback route for signed-in users */}
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </main>
        </SignedIn>
        
        {/* Signed Out Users */}
        <SignedOut>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/create" element={<CreateCollection />} />
            <Route path="/collections/:id" element={<CollectionDetail />} />
            <Route path="/collections/:id/edit" element={<EditCollection />} />
            {/* Redirect all other routes to login for signed-out users */}
            <Route path="*" element={<Login />} />
          </Routes>
        </SignedOut>
      </div>
    </Router>
  )
}

export default App