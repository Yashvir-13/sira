import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { AuthProvider } from './state/AuthContext';
import { ThemeProvider } from './state/ThemeContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AdminRoute } from './routes/AdminRoute';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './routes/HomePage';
import { NewResearchPage } from './routes/NewResearchPage';
import { LoginPage } from './routes/LoginPage';
import { SignupPage } from './routes/SignupPage';
import { ResearchDetailPage } from './routes/ResearchDetailPage';
import { HistoryPage } from './routes/HistoryPage';
import { AdminPage } from './routes/AdminPage';
import { usePageTitle } from './hooks/usePageTitle';

function TitleUpdater() {
  usePageTitle();
  return null;
}

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <TitleUpdater />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/new" element={<NewResearchPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Protected Member Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/research/:id" element={<ResearchDetailPage />} />
                  <Route path="/history" element={<HistoryPage />} />

                  {/* Protected Admin Routes */}
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminPage />} />
                  </Route>
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}

export default App;
