import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MaintenancePage from './pages/MaintenancePage'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import BranchesPage from './pages/BranchesPage'
import TeamPage from './pages/TeamPage'
import GalleryPage from './pages/GalleryPage'
import EventsPage from './pages/EventsPage'
import DonatePage from './pages/DonatePage'
import VolunteerPage from './pages/VolunteerPage'
import ContactPage from './pages/ContactPage'
import MediaPage from './pages/MediaPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { rtdb } from './services/firebase'
import { ref, onValue } from 'firebase/database'

function App() {
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  useEffect(() => {
    let isMounted = true

    try {
      console.log('Attempting to fetch maintenance mode from Firebase...')
      const configRef = ref(rtdb, 'config/maintenanceMode')
      
      const unsubscribe = onValue(
        configRef, 
        (snapshot) => {
          if (isMounted) {
            console.log('Firebase snapshot received:', {
              exists: snapshot.exists(),
              value: snapshot.val(),
              key: snapshot.key
            })
            if (snapshot.exists()) {
              setMaintenanceMode(Boolean(snapshot.val()))
            } else {
              console.log('No maintenance config found - defaulting to false')
              setMaintenanceMode(false)
            }
          }
        }, 
        (error) => {
          if (isMounted) {
            console.warn('Firebase read error (non-blocking):', {
              code: error.code,
              message: error.message
            })
            // Default to false on error - site loads normally
            setMaintenanceMode(false)
          }
        }
      )

      return () => {
        isMounted = false
        unsubscribe()
      }
    } catch (err) {
      console.error('Firebase initialization error:', err)
      // Fail gracefully - site loads normally
      setMaintenanceMode(false)
    }
  }, [])

  // Allow access to admin routes even in maintenance mode
  // This allows admins to log in and turn off maintenance mode
  if (maintenanceMode) {
    return <MaintenancePage />
  }return (
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/branches" element={<BranchesPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/donate" element={<DonatePage />} />
              <Route path="/volunteer" element={<VolunteerPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/media" element={<MediaPage />} />
              <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
