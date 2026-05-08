import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore.js'

// GuestRoute: redirects authenticated users to dashboard.
// Allows access if the user has a pendingVerificationEmail
// (they signed up but haven't verified yet — still a "guest").
export function GuestRoute({ children }) {
  const { isAuthenticated, pendingVerificationEmail } = useAuthStore()

  // Already logged in → send to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  // Has a pending verification → allow /verify-email to be accessible
  // Other auth pages (/login, /signup, etc.) are still accessible to unverified users

  return children
}

export default GuestRoute
