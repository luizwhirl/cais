// selo-fiea-frontend/src/App.tsx

import { Routes, Route } from 'react-router-dom';
import  LandingPage  from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { AdminRegistrationPage } from './pages/AdminRegistrationPage';
import { ManagerRegistrationPage } from './pages/ManagerRegistrationPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilesPage } from './pages/ProfilesPage';
import { BadgesPage } from './pages/BadgesPage';
import { AuditsPage } from './pages/AuditsPage';
// NOVOS IMPORTS
import { IndustryDashboardPage } from './pages/IndustryDashboardPage';
import { SelfAssessmentPage } from './pages/SelfAssessmentPage';

function App() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/admin-register" element={<AdminRegistrationPage />} />
      <Route path="register" element={<ManagerRegistrationPage />} />

      {/* Rotas Protegidas (Admin) */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard/perfis" element={<ProfilesPage />} />
      <Route path="/dashboard/selos" element={<BadgesPage />} />
      <Route path="/dashboard/auditorias" element={<AuditsPage />} />

      {/* NOVAS Rotas Protegidas (Indústria) */}
      <Route path="/industry/dashboard" element={<IndustryDashboardPage />} />
      <Route path="/industry/assessment/:badgeId" element={<SelfAssessmentPage />} />
    </Routes>
  )
}

export default App;