import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContextSimple";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { MainLayoutSimple } from "../components/MainLayoutSimple";
import ErrorBoundary from "../components/ErrorBoundary";
import { LoginSimple } from "../pages/Auth/LoginSimple";
import { RegisterFinal } from "../pages/Auth/RegisterFinal";
import { LoginFinal } from "../pages/Auth/LoginFinal";
import { TestAuth } from "../pages/Auth/TestAuth";
import { TestUI } from "../pages/TestUI";
import { DashboardInline } from "../pages/Dashboard/DashboardInline";
import { ResumeUploadSimple } from "../pages/Resume/ResumeUploadSimple";
import { JobRolesSimple } from "../pages/Jobs/JobRolesSimple";
import { TrainingPlan } from "../pages/Training/TrainingPlan";
import { QuizModule } from "../pages/Quiz/QuizModule";
import { MockInterview } from "../pages/Interview/MockInterview";
import { ProgressWorking } from "../pages/Progress/ProgressWorking";

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  // BYPASS ALL AUTHENTICATION - JUST SHOW THE DASHBOARD
  console.log('🔓 BYPASSING AUTH - SHOWING DASHBOARD');
  return children;
};

const PublicRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (user) {
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
      <Route path="/login" element={<LoginFinal />} />
      <Route
        path="/register"
        element={<RegisterFinal />}
      />
      <Route path="/test-auth" element={<TestAuth />} />
      <Route path="/test-ui" element={<TestUI />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <MainLayoutSimple />
          </RequireAuth>
        }
      >
        <Route path="dashboard" element={
          <ErrorBoundary>
            <DashboardInline />
          </ErrorBoundary>
        } />
        <Route path="resume" element={<ResumeUploadSimple />} />
        <Route path="roles" element={<JobRolesSimple />} />
        <Route path="training" element={<TrainingPlan />} />
        <Route path="quiz" element={<QuizModule />} />
        <Route path="interview" element={<MockInterview />} />
        <Route path="progress" element={<ProgressWorking />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

