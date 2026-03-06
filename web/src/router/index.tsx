import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { MainLayout } from "../components/MainLayout";
import ErrorBoundary from "../components/ErrorBoundary";
import { LoginSimple } from "../pages/Auth/LoginSimple";
import { RegisterWorking } from "../pages/Auth/RegisterWorking";
import { TestAuth } from "../pages/Auth/TestAuth";
import { TestUI } from "../pages/TestUI";
import { DashboardSimple } from "../pages/Dashboard/DashboardSimple";
import { ResumeUploadModern } from "../pages/Resume/ResumeUploadModern";
import { JobRoles } from "../pages/Jobs/JobRoles";
import { TrainingPlan } from "../pages/Training/TrainingPlan";
import { QuizModule } from "../pages/Quiz/QuizModule";
import { MockInterview } from "../pages/Interview/MockInterview";
import { ProgressReal } from "../pages/Progress/ProgressReal";

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  // Simple token check instead of complex auth context
  const token = localStorage.getItem('vm_token');
  const userEmail = localStorage.getItem('vm_user_email');
  
  if (!token || !userEmail) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const PublicRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  // Simple check - if user is logged in, redirect to dashboard
  const token = localStorage.getItem('vm_token');
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Default route - redirect to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Public routes */}
      <Route path="/login" element={<LoginSimple />} />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterWorking />
          </PublicRoute>
        }
      />
      <Route path="/test-auth" element={<TestAuth />} />
      <Route path="/test-ui" element={<TestUI />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route path="dashboard" element={
          <ErrorBoundary>
            <DashboardSimple />
          </ErrorBoundary>
        } />
        <Route path="resume" element={<ResumeUploadModern />} />
        <Route path="roles" element={<JobRoles />} />
        <Route path="training" element={<TrainingPlan />} />
        <Route path="quiz" element={<QuizModule />} />
        <Route path="interview" element={<MockInterview />} />
        <Route path="progress" element={<ProgressReal />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

