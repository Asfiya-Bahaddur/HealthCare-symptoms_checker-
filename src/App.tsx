import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { SymptomChecker } from './components/SymptomChecker';
import { Toaster } from './components/ui/sonner';
import { supabase } from './utils/supabase/client';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'dashboard' | 'checker'>('landing');
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data } = await supabase.auth.getSession();
    if (data?.session) {
      setUser(data.session.user);
      setAccessToken(data.session.access_token);
      setCurrentView('dashboard');
    }
  };

  const handleAuthSuccess = async () => {
    const { data } = await supabase.auth.getSession();
    if (data?.session) {
      setUser(data.session.user);
      setAccessToken(data.session.access_token);
      setCurrentView('dashboard');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAccessToken(null);
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster />
      
      {currentView === 'landing' && (
        <LandingPage onGetStarted={() => setCurrentView('auth')} />
      )}
      
      {currentView === 'auth' && (
        <AuthPage 
          onSuccess={handleAuthSuccess}
          onBack={() => setCurrentView('landing')}
        />
      )}
      
      {currentView === 'dashboard' && (
        <Dashboard
          user={user}
          accessToken={accessToken}
          onLogout={handleLogout}
          onStartChecker={() => setCurrentView('checker')}
        />
      )}
      
      {currentView === 'checker' && (
        <SymptomChecker
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentView('dashboard')}
        />
      )}
    </div>
  );
}