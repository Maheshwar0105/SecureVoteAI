import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Web3Provider } from './context/Web3Context';
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
      '/': 'SecureVoteAI - Decoupled Smart Contract & AI Voting System',
      '/about': 'Architecture & Tech Stack - SecureVoteAI Capstone',
      '/login': 'Voter Sign In - SecureVoteAI',
      '/register': 'Voter Registration - SecureVoteAI',
      '/verify-otp': 'OTP Verification - SecureVoteAI',
      '/dashboard': 'Voting Portal & Dashboard - SecureVoteAI',
      '/admin': 'Chief Election Commission Admin Console - SecureVoteAI',
      '/results': 'Live Audit Results & Ledger Logs - SecureVoteAI'
    };

    const title = titles[location.pathname] || 'SecureVoteAI - Decoupled Smart Contract & AI Voting System';
    document.title = title;
  }, [location]);

  return null;
};

function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Web3Provider>
      <Router>
        <PageTitleUpdater />
        <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
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
                element={user ? <UserDashboard user={user} onUserUpdate={(u) => setUser(u)} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/admin" 
                element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} 
              />
              
              <Route path="/elections/:id" element={<ElectionDetails />} />
              <Route path="/results" element={<Results />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;
