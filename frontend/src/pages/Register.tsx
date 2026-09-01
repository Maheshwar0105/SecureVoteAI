import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import FaceVerifier from '../components/FaceVerifier';
import HolographicIdBadge from '../components/HolographicIdBadge';
import {
  User,
  Mail,
  Lock,
  Phone,
  CreditCard,
  Building,
  GraduationCap,
  Briefcase,
  School,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();

  const [orgType, setOrgType] = useState<'college' | 'company' | 'school' | 'general'>('college');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [voterId, setVoterId] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [organizationName, setOrganizationName] = useState('Apex Institute of Technology & Research');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [yearOrGrade, setYearOrGrade] = useState('3rd Year (Semester 6)');
  const [house, setHouse] = useState('Sapphire');

  const [showFaceScan, setShowFaceScan] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle Domain Switch presets
  const handleDomainChange = (type: 'college' | 'company' | 'school' | 'general') => {
    setOrgType(type);
    if (type === 'college') {
      setOrganizationName('Apex Institute of Technology & Research');
      setDepartment('Computer Science & Engineering');
      setYearOrGrade('3rd Year (Semester 6)');
    } else if (type === 'company') {
      setOrganizationName('Nexus Global Enterprise Ltd.');
      setDepartment('Corporate Cafeteria & Food Welfare Board');
      setYearOrGrade('Senior Engineer');
    } else if (type === 'school') {
      setOrganizationName('Greenwood International Academy');
      setDepartment('Senior Prefect Wing');
      setYearOrGrade('Grade 11 - Section A');
      setHouse('Sapphire');
    } else {
      setOrganizationName('National Democratic Election Commission');
      setDepartment('Metropolitan Ward 42');
      setYearOrGrade('General Citizen');
    }
  };

  const handleSubmitTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShowFaceScan(true); // Open face verification scanner first
  };

  const handleFaceSuccess = async (faceEmbedding: number[]) => {
    setShowFaceScan(false);
    setIsLoading(true);

    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        phoneNumber,
        voterId,
        organizationType: orgType,
        organizationId,
        organizationName,
        department,
        yearOrGrade,
        house,
        faceEmbedding
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      sessionStorage.setItem('justLoggedIn', 'true');
      navigate('/dashboard');
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-12 w-full max-w-full">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-purple-950/60 border border-purple-500/30 px-5 py-2 rounded-full text-sm font-mono text-purple-300 mb-4">
          <ShieldCheck className="h-4.5 w-4.5 text-purple-400" />
          <span>CRYPTOGRAPHIC IDENTITY ENROLLMENT</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Create Voter Account</h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-lg mx-auto leading-relaxed">
          Select your institution category to configure domain-specific credentials & biometric security.
        </p>
      </div>

      {/* Domain Selector Tabs */}
      <div className="flex justify-center flex-wrap gap-3.5 mb-12">
        {[
          { id: 'college', label: 'College Student', icon: GraduationCap },
          { id: 'company', label: 'Company Employee', icon: Briefcase },
          { id: 'school', label: 'School Student', icon: School },
          { id: 'general', label: 'Civic Voter', icon: Building }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = orgType === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleDomainChange(tab.id as any)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 scale-105 border border-purple-400/40'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Form: Registration Fields */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          {error && (
            <div className="flex items-center gap-2.5 bg-red-950/40 border border-red-500/30 p-4 rounded-xl text-red-300 text-sm mb-6">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmitTrigger} className="space-y-5">
            {/* Full Name & Phone Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-4 h-5 w-5 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Mobile Phone (+ OTP)</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-4 h-5 w-5 text-slate-500" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition text-base"
                  />
                </div>
              </div>
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Official Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-4 h-5 w-5 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={orgType === 'college' ? 'student@college.edu' : (orgType === 'company' ? 'emp@company.com' : 'voter@domain.com')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-4 h-5 w-5 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition text-base"
                  />
                </div>
              </div>
            </div>

            {/* Domain-Specific Identification Inputs */}
            <div className="border-t border-slate-800/80 pt-5 mt-3 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ID Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {orgType === 'college' && 'Student Roll Number / PRN'}
                    {orgType === 'company' && 'Corporate Employee ID'}
                    {orgType === 'school' && 'Student Admission Number'}
                    {orgType === 'general' && 'National Voter ID (EPIC)'}
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3.5 top-4 h-5 w-5 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={orgType === 'general' ? voterId : organizationId}
                      onChange={(e) => {
                        if (orgType === 'general') {
                          setVoterId(e.target.value);
                          setOrganizationId(e.target.value);
                        } else {
                          setOrganizationId(e.target.value);
                        }
                      }}
                      placeholder={
                        orgType === 'college' ? 'ROLL-CS-2024-8819' :
                        orgType === 'company' ? 'EMP-NEX-4091' :
                        orgType === 'school' ? 'SCH-ADM-9941' : 'EPIC-MH-2026-8794'
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition text-base font-mono"
                    />
                  </div>
                </div>

                {/* Institution Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {orgType === 'college' && 'College / University Name'}
                    {orgType === 'company' && 'Company / Enterprise Name'}
                    {orgType === 'school' && 'School Name'}
                    {orgType === 'general' && 'Election Commission / Ward'}
                  </label>
                  <input
                    type="text"
                    required
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="Institution Name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:border-purple-500 transition text-base"
                  />
                </div>
              </div>

              {/* Department & Year/House */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {orgType === 'college' && 'Department / Branch'}
                    {orgType === 'company' && 'Department / Committee'}
                    {orgType === 'school' && 'House System'}
                    {orgType === 'general' && 'Constituency / Ward'}
                  </label>
                  {orgType === 'school' ? (
                    <select
                      value={house}
                      onChange={(e) => setHouse(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:border-purple-500 transition text-base"
                    >
                      <option value="Ruby">Ruby House (Red)</option>
                      <option value="Sapphire">Sapphire House (Blue)</option>
                      <option value="Emerald">Emerald House (Green)</option>
                      <option value="Topaz">Topaz House (Gold)</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder={
                        orgType === 'college' ? 'e.g. Computer Science & AI' :
                        orgType === 'company' ? 'e.g. Cafeteria & Food Dept' : 'e.g. Metropolitan Ward 42'
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:border-purple-500 transition text-base"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {orgType === 'college' && 'Year / Semester'}
                    {orgType === 'company' && 'Designation / Grade'}
                    {orgType === 'school' && 'Class / Standard'}
                    {orgType === 'general' && 'Citizen Category'}
                  </label>
                  <input
                    type="text"
                    required
                    value={yearOrGrade}
                    onChange={(e) => setYearOrGrade(e.target.value)}
                    placeholder={
                      orgType === 'college' ? 'e.g. 3rd Year (Sem 6)' :
                      orgType === 'company' ? 'e.g. Senior Staff' :
                      orgType === 'school' ? 'e.g. Grade 11 - Section A' : 'Resident Voter'
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:border-purple-500 transition text-base"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition cursor-pointer text-base shadow-lg shadow-purple-500/20 active:scale-[0.98] mt-5 flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Creating Web3 Credentials...' : 'Proceed to Biometric Verification'}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already registered?{' '}
            <span onClick={() => navigate('/login')} className="text-purple-400 hover:underline cursor-pointer font-semibold">
              Login here
            </span>
          </p>
        </div>

        {/* Right Column: Live 3D Holographic Card Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">
            LIVE 3D HOLOGRAPHIC ID BADGE PREVIEW
          </p>
          <HolographicIdBadge
            user={{
              name: name || 'Your Full Name',
              email: email || 'your.email@domain.com',
              phoneNumber: phoneNumber || '+91 98765 43210',
              voterId: voterId || (orgType === 'general' ? 'EPIC-MH-2026-8794' : undefined),
              organizationType: orgType,
              organizationId: organizationId || (orgType === 'college' ? 'ROLL-CS-2024-8819' : (orgType === 'company' ? 'EMP-NEX-4091' : 'SCH-ADM-9941')),
              organizationName: organizationName,
              department: orgType === 'school' ? `${house} House` : department,
              yearOrGrade: yearOrGrade,
              house: house,
              role: 'voter'
            }}
          />

          <div className="mt-4 p-5 bg-slate-900/60 border border-slate-800 rounded-2xl w-full max-w-md text-sm text-slate-400 space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="h-4.5 w-4.5" />
              <span>Tamper-Resistant Proof</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
              Your profile will be cryptographically bound to a unique smart contract transaction and verified using webcam facial embeddings.
            </p>
          </div>
        </div>
      </div>

      {showFaceScan && (
        <FaceVerifier
          email={email}
          onVerificationSuccess={handleFaceSuccess}
          onClose={() => setShowFaceScan(false)}
          actionText="Register Biometrics"
        />
      )}
    </div>
  );
};

export default Register;
