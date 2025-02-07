import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Emergency } from './pages/Emergency';
import { PhysicalHelp } from './pages/PhysicalHelp';
import { MentalHelp } from './pages/MentalHelp';
import { UserProfile } from './pages/UserProfile';
import { UserDashboard } from './pages/UserDashboard';
import { MedicalOnboarding } from './pages/MedicalOnboarding';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

// App Router setup
function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/emergency" element={<Emergency />} />
      <Route path="/physical-help" element={<PhysicalHelp />} />
      <Route path="/mental-help" element={<MentalHelp />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/medical-onboarding"
        element={
          <ProtectedRoute>
            <MedicalOnboarding />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <AppRouter />
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;