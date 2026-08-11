import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
        <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
          <Navbar user={user} onLogout={handleLogout} onUserUpdate={(u) => setUser(u)} />
          
          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<LandingPage />} />
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
