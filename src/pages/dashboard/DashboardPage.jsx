import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import ChatBox from '../../components/chat/ChatBox';
import { useAuth } from '../../context/AuthContext';

/**
 * Dashboard page that contains the AI Tutor chat interface
 * Accessible only to authenticated users
 */
const DashboardPage = () => {
  const { currentUser, isAuthenticated } = useAuth();

  // Debug: Log current user to verify what properties are available
  useEffect(() => {
    console.log('Current user:', currentUser);
  }, [currentUser]);

  // Redirect to login if user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Get user's display name - first check if there's a nested data object (API structure)
  // then check common name properties directly on the currentUser object
  const displayName =
    currentUser?.data?.name ||
    currentUser?.name ||
    currentUser?.data?.userName ||
    currentUser?.userName ||
    currentUser?.data?.username ||
    currentUser?.username ||
    currentUser?.data?.fullName ||
    currentUser?.fullName ||
    'Student';

  return (
    <MainLayout>
      <div className="container py-4">
        <div className="row mb-4">
          <div className="col-12">
            <h2>Welcome, {displayName}!</h2>
            <p className="text-muted">
              Ask any question about your coursework and get help from your AI
              tutor.
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8 col-md-10 mx-auto">
            <ChatBox />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
