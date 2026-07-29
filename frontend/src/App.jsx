import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { DetectorPage } from './pages/DetectorPage';
import { ResultPage } from './pages/ResultPage';
import { Dashboard } from './pages/Dashboard';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

export function AppContent() {
  const [activePage, setActivePage] = useState('landing');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleAnalysisComplete = (resultPayload) => {
    setAnalysisResult(resultPayload);
    setActivePage('result');
    showToast(`Analysis complete: Classified as ${resultPayload.prediction} News`, resultPayload.prediction === 'Fake' ? 'error' : 'success');
  };

  const handleViewHistoryDetail = (item) => {
    setAnalysisResult(item);
    setActivePage('result');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      <main className="flex-1">
        {activePage === 'landing' && (
          <LandingPage
            onStartAnalysis={() => setActivePage('detector')}
            onExploreDashboard={() => setActivePage('dashboard')}
          />
        )}

        {activePage === 'login' && (
          <Login
            onNavigateRegister={() => setActivePage('register')}
            onNavigateForgotPassword={() => setActivePage('forgot-password')}
            onSuccessLogin={() => {
              showToast('Login successful!', 'success');
              setActivePage('detector');
            }}
          />
        )}

        {activePage === 'register' && (
          <Register
            onNavigateLogin={() => setActivePage('login')}
            onSuccessRegister={() => {
              showToast('Account created successfully!', 'success');
              setActivePage('detector');
            }}
          />
        )}

        {activePage === 'forgot-password' && (
          <ForgotPassword onNavigateLogin={() => setActivePage('login')} />
        )}

        {activePage === 'detector' && (
          <DetectorPage onAnalysisComplete={handleAnalysisComplete} />
        )}

        {activePage === 'result' && (
          <ResultPage
            result={analysisResult}
            onNewAnalysis={() => setActivePage('detector')}
          />
        )}

        {activePage === 'dashboard' && (
          <Dashboard onViewDetail={handleViewHistoryDetail} />
        )}

        {activePage === 'history' && (
          <HistoryPage onViewDetail={handleViewHistoryDetail} />
        )}

        {activePage === 'profile' && (
          <ProtectedRoute onNavigateLogin={() => setActivePage('login')}>
            <ProfilePage />
          </ProtectedRoute>
        )}

        {activePage === 'admin' && (
          <ProtectedRoute adminOnly={true} onNavigateLogin={() => setActivePage('login')}>
            <AdminPage />
          </ProtectedRoute>
        )}

        {activePage === 'about' && <AboutPage />}

        {activePage === 'contact' && <ContactPage />}
      </main>

      <Footer setActivePage={setActivePage} />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
