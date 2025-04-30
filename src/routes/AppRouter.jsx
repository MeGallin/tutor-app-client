import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import pages
import LandingPage from '../pages/LandingPage';

// Use lazy loading for authentication pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));

/**
 * Main router component that defines all application routes
 */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="container p-5 text-center">Loading...</div>}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Catch-all route - redirect to home */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}