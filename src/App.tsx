import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { BottomNav } from "./components/BottomNav";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Network from "./pages/Network";
import Support from "./pages/Support";
import Resources from "./pages/Resources";
import Games from "./pages/Games";
import Forums from "./pages/Forums";
import CommunityPage from "./pages/CommunityPage";
import AuthCallback from '@/pages/AuthCallback';
import CompleteProfile from './pages/CompleteProfile';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const location = useLocation();
  const showNav = location.pathname !== "/login";

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/complete-profile" element={
          <ProtectedRoute>
            <CompleteProfile />
          </ProtectedRoute>
        } />
        
        {/* Protected Routes */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/network" element={
          <ProtectedRoute>
            <Network />
          </ProtectedRoute>
        } />
        {/* <Route path="/support" element={
          <ProtectedRoute>
            <Support />
          </ProtectedRoute>
        } /> */}
        <Route path="/resources" element={
          <ProtectedRoute>
            <Resources />
          </ProtectedRoute>
        } />
        {/* <Route path="/games" element={
          <ProtectedRoute>
            <Games />
          </ProtectedRoute>
        } /> */}
        <Route path="/forums" element={
          <ProtectedRoute>
            <Forums />
          </ProtectedRoute>
        } />
        <Route path="/forums/:id" element={
          <ProtectedRoute>
            <CommunityPage />
          </ProtectedRoute>
        } />
      </Routes>
      {showNav && <BottomNav />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
