import React, { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ErrorBoundary from './components/ErrorBoundary'
import { rtdb } from './services/firebase'
import { ref, onValue } from 'firebase/database'

// Lazy-loaded pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const BranchesPage = lazy(() => import('./pages/BranchesPage'))
const TeamPage = lazy(() => import('./pages/TeamPage'))
const GalleryPage = lazy(() => import('./pages/GalleryPage'))
const EventsPage = lazy(() => import('./pages/EventsPage'))
const DonatePage = lazy(() => import('./pages/DonatePage'))
const VolunteerPage = lazy(() => import('./pages/VolunteerPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const MediaPage = lazy(() => import('./pages/MediaPage'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const MaintenancePage = lazy(() => import('./pages/MaintenancePage'))
import ProtectedRoute from './components/ProtectedRoute'

// Page loading fallback
const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 mb-4" />
      <p className="text-gray-600 animate-pulse">Loading...</p>
    </div>
  </div>
)

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
  if (maintenanceMode && import.meta.env.MODE === 'production') {
    return (
      <Suspense fallback={<PageLoader />}>
        <MaintenancePage />
      </Suspense>
    )
  }

  return (
    <AuthProvider>
      <NotificationProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <ScrollToTop />
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
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
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </main>
            <Footer />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
