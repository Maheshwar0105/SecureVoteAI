import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { KeyRound, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

interface VerifyOTPProps {
  onLoginSuccess: (user: any) => void;
}

export const VerifyOTP: React.FC<VerifyOTPProps> = ({ onLoginSuccess }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      const { token, user, message } = res.data;

      setSuccess(message || 'Verification successful!');
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setTimeout(() => {
        onLoginSuccess(user);
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Verification failed. Please check the code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex justify-center items-center py-20 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <Card className="w-full max-w-md p-8 shadow-2xl">
        
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-3 border border-purple-500/20">
            <KeyRound className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Email Verification</h2>
          <p className="text-slate-400 text-xs mt-1 text-center font-mono">Enter the 6-digit OTP code sent to your email.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-rose-950/40 border border-rose-500/30 p-3 rounded-xl text-rose-300 text-xs mb-6 font-mono">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl text-emerald-300 text-xs mb-6 font-mono">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!location.state?.email && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voter@college.edu"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition text-sm font-mono"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">6-Digit OTP</label>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center tracking-widest text-lg font-bold text-white placeholder-slate-700 focus:outline-none focus:border-purple-500 transition font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !!success}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition cursor-pointer text-sm shadow-lg shadow-purple-500/10 active:scale-[0.98] mt-2"
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
      </Card>
    </div>
  );
};
export default VerifyOTP;
