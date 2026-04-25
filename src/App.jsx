import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import AppLayout from './components/layout/AppLayout';
import LoadingWatchdog from './components/LoadingWatchdog';
import { usePageTracking } from './hooks/usePageTracking';

// ─── Lazy load all pages ───────────────────────────────────────────────────
// Keep LandingPage, LoginPage, SignupPage eager (first paint pages)
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Everything else — lazy loaded (only downloads when user visits that route)
const OnboardingPage        = lazy(() => import('./pages/OnboardingPage'));
const DashboardPage         = lazy(() => import('./pages/DashboardPage'));
const BudgetPage            = lazy(() => import('./pages/BudgetPage'));
const TasksPage             = lazy(() => import('./pages/TasksPage'));
const TimelinePage          = lazy(() => import('./pages/TimelinePage'));
const VendorsPage           = lazy(() => import('./pages/VendorsPage'));
const InspirationPage       = lazy(() => import('./pages/InspirationPage'));
const SettingsPage          = lazy(() => import('./pages/SettingsPage'));
const WeddingPickerPage     = lazy(() => import('./pages/WeddingPickerPage'));
const InviteAcceptPage      = lazy(() => import('./pages/InviteAcceptPage'));
const CreateInvitationPage  = lazy(() => import('./pages/CreateInvitationPage'));
const InvitationsPage       = lazy(() => import('./pages/InvitationsPage'));
const WhatsappPage          = lazy(() => import('./pages/WhatsappPage'));
const UpdatePasswordPage    = lazy(() => import('./pages/UpdatePasswordPage'));
const PersonalizeWizard     = lazy(() => import('./pages/PersonalizeWizard'));

// Wedding Website & RSVP
const RSVPDashboardPage          = lazy(() => import('./pages/RSVPDashboardPage'));
const MyWeddingPageBuilder       = lazy(() => import('./pages/MyWeddingPageBuilder'));
const SendRemindersPage          = lazy(() => import('./pages/SendRemindersPage'));
const ThemesPage                 = lazy(() => import('./pages/ThemesPage'));
const DummyWebsitePlaceholder    = lazy(() => import('./pages/DummyWebsitePlaceholder'));

// Blog Pages
const BlogListingPage       = lazy(() => import('./pages/BlogListingPage'));
const BlogPostPage          = lazy(() => import('./pages/BlogPostPage'));
const PublicBudgetCalculatorPage = lazy(() => import('./pages/PublicBudgetCalculatorPage'));
const PublicChecklistPage   = lazy(() => import('./pages/PublicChecklistPage'));

// Marketplace Pages
const MarketplaceLandingPage   = lazy(() => import('./pages/marketplace/MarketplaceLandingPage'));
const CategoryListingPage      = lazy(() => import('./pages/marketplace/CategoryListingPage'));
const VendorDetailPage         = lazy(() => import('./pages/marketplace/VendorDetailPage'));
const VendorPortalPage         = lazy(() => import('./pages/marketplace/VendorPortalPage'));
const VendorListingEditorPage  = lazy(() => import('./pages/marketplace/VendorListingEditorPage'));

// Public Wedding Website Page
const WeddingWebsitePage       = lazy(() => import('./pages/WeddingWebsitePage'));


// Admin Pages
const AdminDashboardPage    = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminLoginPage        = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminBlogPage         = lazy(() => import('./pages/admin/AdminBlogPage'));
const AdminBlogEditorPage   = lazy(() => import('./pages/admin/AdminBlogEditorPage'));
const AdminVendorListPage   = lazy(() => import('./pages/admin/AdminVendorListPage'));
const AdminVendorReviewPage = lazy(() => import('./pages/admin/AdminVendorReviewPage'));
// ──────────────────────────────────────────────────────────────────────────

// Route guard: redirect to login if not authenticated
function ProtectedRoute({ children }) {
  const { isAuthenticated, isRecoveringPassword, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (isRecoveringPassword) return <Navigate to="/update-password" replace />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

// Route guard: redirect to onboarding if not onboarded
function OnboardedRoute({ children }) {
  const { currentUser, isAuthenticated, isOnboarded, activeWeddingId, isRecoveringPassword, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (isRecoveringPassword) return <Navigate to="/update-password" replace />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  // Vendors should never hit couple onboarding — send them to vendor dashboard
  const isVendor = currentUser?.user_metadata?.role === 'vendor';
  if (isVendor) return <Navigate to="/vendor/dashboard" replace />;
  
  if (!isOnboarded) return <Navigate to="/onboarding" replace />;
  if (!activeWeddingId) return <Navigate to="/weddings" replace />;
  return children;
}

// Public route: redirect to dashboard if already logged in
function PublicRoute({ children }) {
  const { currentUser, isAuthenticated, isOnboarded, activeWeddingId, isRecoveringPassword, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (isRecoveringPassword) return <Navigate to="/update-password" replace />;
  
  // Vendors should always go to their dashboard, never couple onboarding
  const isVendor = currentUser?.user_metadata?.role === 'vendor';
  if (isAuthenticated && isVendor) return <Navigate to="/vendor/dashboard" replace />;
  
  if (isAuthenticated && isOnboarded && activeWeddingId) return <Navigate to="/dashboard" replace />;
  if (isAuthenticated && isOnboarded && !activeWeddingId) return <Navigate to="/weddings" replace />;
  if (isAuthenticated && !isOnboarded) return <Navigate to="/onboarding" replace />;
  return children;
}

// Admin Route: restricts access to users with isAdmin
function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, isRecoveringPassword, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (isRecoveringPassword) return <Navigate to="/update-password" replace />;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

function AdminPublicRoute({ children }) {
  const { isAuthenticated, isAdmin, isRecoveringPassword, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (isRecoveringPassword) return <Navigate to="/update-password" replace />;
  if (isAuthenticated && isAdmin) return <Navigate to="/admin" replace />;
  if (isAuthenticated && !isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blush to-ivory">
      <div className="text-center animate-pulse-soft">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center mx-auto mb-3 shadow-lg">
          <svg className="w-6 h-6 text-white" fill="white" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

// Wrapper that provides AppContext with userId + Loading Watchdog
function AppWithContext() {
  const { currentUser, authReady, activeWeddingId, isRecoveringPassword } = useAuth();
  const navigate = useNavigate();

  usePageTracking();

  useEffect(() => {
    if (isRecoveringPassword) {
      navigate('/update-password', { replace: true });
    }
  }, [isRecoveringPassword, navigate]);

  return (
    <LoadingWatchdog isLoading={!authReady && !isRecoveringPassword}>
      <AppProvider userId={currentUser?.id} weddingId={activeWeddingId}>

        {/* ✅ Suspense wraps ALL routes — shows LoadingScreen during lazy loads */}
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Invite route must be above the rest to intercept securely */}
            <Route path="/invite/:token" element={<InviteAcceptPage />} />
            <Route path="/update-password" element={<UpdatePasswordPage />} />

            {/* Public Auth/Landing */}
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

            {/* Truly Public Pages */}
            <Route path="/blog" element={<BlogListingPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/create-invitation" element={<CreateInvitationPage />} />
            <Route path="/wedding-budget-calculator" element={<PublicBudgetCalculatorPage />} />
            <Route path="/wedding-checklist" element={<PublicChecklistPage />} />
            <Route path="/admin/login" element={<AdminPublicRoute><AdminLoginPage /></AdminPublicRoute>} />

            {/* Public Wedding Website */}
            <Route path="/w/:weddingSlug" element={<WeddingWebsitePage />} />


            {/* Public Marketplace (no login required) */}
            <Route path="/marketplace" element={<MarketplaceLandingPage />} />
            <Route path="/marketplace/:category" element={<CategoryListingPage />} />
            <Route path="/marketplace/:category/:slug" element={<VendorDetailPage />} />

            {/* Vendor Portal (login required, but no onboarding needed) */}
            <Route path="/vendor/dashboard" element={<ProtectedRoute><VendorPortalPage /></ProtectedRoute>} />
            <Route path="/vendor/dashboard/edit" element={<ProtectedRoute><VendorListingEditorPage /></ProtectedRoute>} />

            {/* Wedding Picker */}
            <Route path="/weddings" element={
              <ProtectedRoute><WeddingPickerPage /></ProtectedRoute>
            } />

            {/* Onboarding */}
            <Route path="/onboarding" element={
              <ProtectedRoute><OnboardingPage /></ProtectedRoute>
            } />

            {/* Post-signup personalization wizard */}
            <Route path="/personalize" element={
              <ProtectedRoute><PersonalizeWizard /></ProtectedRoute>
            } />

            {/* Protected App */}
            <Route element={<OnboardedRoute><AppLayout /></OnboardedRoute>}>
              <Route path="/dashboard"   element={<DashboardPage />} />
              <Route path="/invitations" element={<InvitationsPage />} />
              <Route path="/whatsapp"    element={<WhatsappPage />} />

              {/* Website & RSVP (New Nav) */}
              <Route path="/dashboard/rsvp" element={<RSVPDashboardPage />} />
              <Route path="/my-website"     element={<MyWeddingPageBuilder />} />
              <Route path="/send-reminders" element={<SendRemindersPage />} />
              <Route path="/themes"         element={<ThemesPage />} />

              <Route path="/budget"      element={<BudgetPage />} />
              <Route path="/tasks"       element={<TasksPage />} />
              <Route path="/timeline"    element={<TimelinePage />} />
              <Route path="/vendors"     element={<VendorsPage />} />
              <Route path="/inspiration" element={<InspirationPage />} />
              <Route path="/settings"    element={<SettingsPage />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoute><AppLayout /></AdminRoute>}>
              <Route path="/admin"              element={<AdminDashboardPage />} />
              <Route path="/admin/blog"         element={<AdminBlogPage />} />
              <Route path="/admin/blog/new"     element={<AdminBlogEditorPage />} />
              <Route path="/admin/blog/:id/edit" element={<AdminBlogEditorPage />} />
              <Route path="/admin/vendors"      element={<AdminVendorListPage />} />
              <Route path="/admin/vendors/:id"  element={<AdminVendorReviewPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>

      </AppProvider>
    </LoadingWatchdog>
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