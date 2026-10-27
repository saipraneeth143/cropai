import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './lib/useAuth';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import NewFarmPage from './pages/NewFarmPage';
import FarmDetailPage from './pages/FarmDetailPage';
import AdvisoryDetailPage from './pages/AdvisoryDetailPage';
import LoadingSpinner from './components/LoadingSpinner';

function ProtectedRoute({ children, user }) {
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <LoadingSpinner size="lg" message="Initializing CropAI..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/auth"
          element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farms/new"
          element={
            <ProtectedRoute user={user}>
              <NewFarmPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farms/:id"
          element={
            <ProtectedRoute user={user}>
              <FarmDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advisory/:id"
          element={
            <ProtectedRoute user={user}>
              <AdvisoryDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
