import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthGuard from '../components/common/AuthGuard';

// Import pages
import LandingPage from '../pages/LandingPage';

// Use lazy loading for authentication and dashboard pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));

/**
 * Main router component wrapper to handle BrowserRouter
 */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

// Loading fallback component
const SuspenseFallback = () => (
  <div className="container py-5 text-center">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    <p className="mt-3">Loading...</p>
  </div>
);

/**
 * Internal routes component that can use hooks
 */
function AppRoutes() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Routes>
        {/* Public routes - accessible to all users */}
        <Route path="/" element={<LandingPage />} />

        {/* Guest-only routes - redirect to dashboard if already logged in */}
        <Route
          path="/login"
          element={
            <AuthGuard requireAuth={false}>
              <LoginPage />
            </AuthGuard>
          }
        />

        <Route
          path="/register"
          element={
            <AuthGuard requireAuth={false}>
              <RegisterPage />
            </AuthGuard>
          }
        />

        {/* Protected routes - require authentication */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <DashboardPage />
            </AuthGuard>
          }
        />

        {/* Catch-all route - redirect to home */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Suspense>
  );
}
