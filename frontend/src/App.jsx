import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CareersExplorePage } from './pages/CareersExplorePage';
import { CareerDetailsPage } from './pages/CareerDetailsPage';
import { CoursesExplorePage } from './pages/CoursesExplorePage';

// Student Pages
import { StudentDashboard } from './pages/StudentDashboard';
import { StudentProfilePage } from './pages/StudentProfilePage';
import { AssessmentPage } from './pages/AssessmentPage';
import { RecommendationResultsPage } from './pages/RecommendationResultsPage';
import { SavedCareersPage } from './pages/SavedCareersPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { StudentManagement } from './pages/admin/StudentManagement';
import { CareerManagement } from './pages/admin/CareerManagement';
import { ResourceManagement } from './pages/admin/ResourceManagement';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';

// Error & Fallback Pages
import { NotFoundPage } from './pages/NotFoundPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/careers" element={<CareersExplorePage />} />
              <Route path="/careers/:id" element={<CareerDetailsPage />} />
              <Route path="/courses" element={<CoursesExplorePage />} />

              {/* Protected Student Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <StudentProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/assessment" element={
                <ProtectedRoute>
                  <AssessmentPage />
                </ProtectedRoute>
              } />
              <Route path="/assessments/:id/results" element={
                <ProtectedRoute>
                  <RecommendationResultsPage />
                </ProtectedRoute>
              } />
              <Route path="/recommendations" element={
                <ProtectedRoute>
                  <RecommendationResultsPage />
                </ProtectedRoute>
              } />
              <Route path="/saved-careers" element={
                <ProtectedRoute>
                  <SavedCareersPage />
                </ProtectedRoute>
              } />

              {/* Protected Administrator Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/students" element={
                <ProtectedRoute requireAdmin={true}>
                  <StudentManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/careers" element={
                <ProtectedRoute requireAdmin={true}>
                  <CareerManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/resources" element={
                <ProtectedRoute requireAdmin={true}>
                  <ResourceManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/analytics" element={
                <ProtectedRoute requireAdmin={true}>
                  <AnalyticsPage />
                </ProtectedRoute>
              } />

              {/* Error Routes */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
