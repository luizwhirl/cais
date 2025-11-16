import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { AdminRegistrationPage } from './pages/AdminRegistrationPage';
import { ManagerRegistrationPage } from './pages/ManagerRegistrationPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilesPage } from './pages/ProfilesPage';
import { BadgesPage } from './pages/BadgesPage';
import { CriteriaPage } from './pages/CriteriaPage';
import { AuditsPage } from './pages/AuditsPage';
import { IndustryDashboardPage } from './pages/IndustryDashboardPage';
import { SelfAssessmentPage } from './pages/SelfAssessmentPage';
import { MyCompaniesPage } from './pages/MyCompaniesPage';
import { DigitalBadgesPage } from './pages/DigitalBadgesPage';
import { BadgeVerificationPage } from './pages/BadgeVerificationPage';

import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { IndustryLayout } from './layouts/IndustryLayout';

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/admin-register" element={<AdminRegistrationPage />} />
        <Route path="/register" element={<ManagerRegistrationPage />} />
        <Route path="/verificacao/:verificationId" element={<BadgeVerificationPage />} />
      </Route>

      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/perfis" element={<ProfilesPage />} />
        <Route path="/dashboard/selos" element={<BadgesPage />} />
        <Route path="/dashboard/auditorias" element={<AuditsPage />} />
        <Route path="/dashboard/criterios" element={<CriteriaPage />} />
      </Route>

      <Route element={<IndustryLayout />}>
        <Route path="/industry/dashboard" element={<IndustryDashboardPage />} />
        <Route path="/industry/assessment/:badgeId" element={<SelfAssessmentPage />} />
        <Route path="/industry/dashboard/empresas" element={<MyCompaniesPage />} />
        <Route path="/industry/dashboard/selos" element={<DigitalBadgesPage />} />
      </Route>
    </Routes>
  )
}

export default App;