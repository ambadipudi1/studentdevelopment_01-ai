import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import { AppLayout } from './layouts/AppLayout.tsx';

// Pages
import { LandingPage } from './pages/LandingPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { CareerPage } from './pages/CareerPage.tsx';
import { SkillGapPage } from './pages/SkillGapPage.tsx';
import { RoadmapPage } from './pages/RoadmapPage.tsx';
import { StudyPlanPage } from './pages/StudyPlanPage.tsx';
import { ProjectsPage } from './pages/ProjectsPage.tsx';
import { AiCoachPage } from './pages/AiCoachPage.tsx';
import { AssessmentPage } from './pages/AssessmentPage.tsx';
import { InterviewPage } from './pages/InterviewPage.tsx';
import { ProgressPage } from './pages/ProgressPage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Application Layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/career" element={<CareerPage />} />
            <Route path="/skill-gap" element={<SkillGapPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/study-plan" element={<StudyPlanPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/ai-coach" element={<AiCoachPage />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
