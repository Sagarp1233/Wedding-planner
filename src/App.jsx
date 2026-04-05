import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import AppLayout from './components/layout/AppLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import BudgetPage from './pages/BudgetPage';
import GuestsPage from './pages/GuestsPage';
import TasksPage from './pages/TasksPage';
import TimelinePage from './pages/TimelinePage';
import VendorsPage from './pages/VendorsPage';
import InspirationPage from './pages/InspirationPage';
import SettingsPage from './pages/SettingsPage';

// Route guard: redirect to login if not authenticated
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

// Route guard: redirect to onboarding if not onboarded
function OnboardedRoute({ children }) {
  const { isAuthenticated, isOnboarded, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isOnboarded) return <Navigate to="/onboarding" replace />;
  return children;
}

// Public route: redirect to dashboard if already logged in
function PublicRoute({ children }) {
  const { isAuthenticated, isOnboarded, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (isAuthenticated && isOnboarded) return <Navigate to="/dashboard" replace />;
  if (isAuthenticated && !isOnboarded) return <Navigate to="/onboarding" replace />;
  return children;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blush to-ivory">
      <div className="text-center animate-pulse-soft">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center mx-auto mb-3 shadow-lg">
          <svg className="w-6 h-6 text-white" fill="white" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </div>
        <p className="text-sm font-medium text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

// Wrapper that provides AppContext with userId
function AppWithContext() {
  const { currentUser } = useAuth();
  return (
    <AppProvider userId={currentUser?.id}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

        {/* Onboarding — uses the SAME AppProvider */}
        <Route path="/onboarding" element={
          <ProtectedRoute><OnboardingPage /></ProtectedRoute>
        } />

        {/* Protected App */}
        <Route element={<OnboardedRoute><AppLayout /></OnboardedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/guests" element={<GuestsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/vendors" element={<VendorsPage />} />
          <Route path="/inspiration" element={<InspirationPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppWithContext />
      </AuthProvider>
    </BrowserRouter>
  );
}
