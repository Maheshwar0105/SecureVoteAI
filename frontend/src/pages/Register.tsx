import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import FaceVerifier from '../components/FaceVerifier';
import HolographicIdBadge from '../components/HolographicIdBadge';
import Card from '../components/Card';
import Badge from '../components/Badge';
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
    setShowFaceScan(true);
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
        <Badge variant="primary" icon={ShieldCheck} className="mb-4">
          CRYPTOGRAPHIC IDENTITY ENROLLMENT
        </Badge>
        <h1 className="heading-xl">Create Voter Account</h1>
        <p className="body-base max-w-lg mx-auto mt-2">
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
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
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
        <Card className="lg:col-span-7 p-6 sm:p-8">
          {error && (
            <div className="flex items-center gap-2.5 bg-rose-950/40 border border-rose-500/30 p-4 rounded-xl text-rose-300 text-sm mb-6 font-mono">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmitTrigger} className="space-y-5">
            {/* Full Name & Phone Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-4 h-5 w-5 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">Mobile Phone (+ OTP)</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-4 h-5 w-5 text-slate-500" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">Official Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-4 h-5 w-5 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={orgType === 'college' ? 'student@college.edu' : (orgType === 'company' ? 'emp@company.com' : 'voter@domain.com')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-4 h-5 w-5 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Domain-Specific Identification Inputs */}
            <div className="border-t border-slate-800/80 pt-5 mt-3 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ID Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
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
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition text-sm font-mono"
                    />
                  </div>
                </div>

                {/* Institution Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:border-purple-500 transition text-sm"
                  />
                </div>
              </div>

              {/* Department & Year/House */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                    {orgType === 'college' && 'Department / Branch'}
                    {orgType === 'company' && 'Department / Committee'}
                    {orgType === 'school' && 'House System'}
                    {orgType === 'general' && 'Constituency / Ward'}
                  </label>
                  {orgType === 'school' ? (
                    <select
                      value={house}
                      onChange={(e) => setHouse(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:border-purple-500 transition text-sm"
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
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:border-purple-500 transition text-sm"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:border-purple-500 transition text-sm"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-600 hover:from-purple-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition cursor-pointer text-sm shadow-lg shadow-purple-500/20 active:scale-[0.98] mt-5 flex items-center justify-center gap-2"
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
        </Card>

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

          <Card className="mt-4 p-5 w-full max-w-md">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
              <ShieldCheck className="h-4.5 w-4.5" />
              <span>Tamper-Resistant Proof</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your profile will be cryptographically bound to a unique smart contract transaction and verified using webcam facial embeddings.
            </p>
          </Card>
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
