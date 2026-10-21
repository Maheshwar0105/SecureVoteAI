import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Web3Provider } from './context/Web3Context';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ElectionDetails from './pages/ElectionDetails';
import Results from './pages/Results';
import About from './pages/About';

// Dynamic Title Setter Component per Route
const PageTitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'SecureVoteAI — Blockchain & AI Voting System',
      '/about': 'Architecture & Tech Stack — SecureVoteAI',
      '/login': 'Sign In — SecureVoteAI',
      '/register': 'Register — SecureVoteAI',
      '/verify-otp': 'Verify OTP — SecureVoteAI',
      '/dashboard': 'Voting Portal — SecureVoteAI',
      '/admin': 'Admin Console — SecureVoteAI',
      '/results': 'Audit Results — SecureVoteAI',
    };

    document.title = titles[location.pathname] ?? 'SecureVoteAI — Blockchain & AI Voting System';
  }, [location]);

  return null;
};

function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        <Web3Provider>
          <Router>
            <PageTitleUpdater />
            {/* Root div picks up --color-bg from CSS custom properties */}
            <div
              className="min-h-screen flex flex-col font-sans"
              style={{ background: 'var(--color-bg)', color: 'var(--color-text-primary)' }}
            >
              <Navbar user={user} onLogout={handleLogout} onUserUpdate={(u) => setUser(u)} />

              <main className="flex-1 flex flex-col">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login onLoginSuccess={(u) => setUser(u)} />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/verify-otp" element={<VerifyOTP onLoginSuccess={(u) => setUser(u)} />} />

                  <Route
                    path="/dashboard"
                    element={user ? <UserDashboard user={user} onUserUpdate={(u) => setUser(u)} /> : <Navigate to="/login" replace />}
                  />
                  <Route
                    path="/admin"
                    element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" replace />}
                  />

                  <Route path="/elections/:slug" element={<ElectionDetails />} />
                  <Route path="/results" element={<Results />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </Router>
        </Web3Provider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
