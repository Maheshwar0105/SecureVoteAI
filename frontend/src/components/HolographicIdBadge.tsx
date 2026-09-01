import React, { useState } from 'react';
import { ShieldCheck, Fingerprint, QrCode, Cpu, Sparkles, Building, GraduationCap, Briefcase, School } from 'lucide-react';

interface HolographicIdBadgeProps {
  user: {
    name: string;
    email: string;
    phoneNumber?: string;
    voterId?: string;
    organizationType?: 'general' | 'college' | 'company' | 'school';
    organizationId?: string;
    organizationName?: string;
    department?: string;
    yearOrGrade?: string;
    house?: string;
    role?: string;
    isVerified?: boolean;
    isWalletBound?: boolean;
    walletAddress?: string;
  };
}

export const HolographicIdBadge: React.FC<HolographicIdBadgeProps> = ({ user }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -12; // Max 12deg tilt
    const rY = ((x - centerX) / centerX) * 12;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos({ x: 50, y: 50 });
  };

  const orgType = user.organizationType || 'general';

  // Domain Theme Configurations
  const themes = {
    college: {
      accent: 'from-cyan-500 via-indigo-500 to-purple-600',
      badgeBg: 'bg-cyan-950/60 border-cyan-500/30 text-cyan-300',
      borderGlow: 'hover:shadow-cyan-500/20',
      title: 'UNIVERSITY STUDENT CREDENTIAL',
      icon: GraduationCap,
      idLabel: 'STUDENT ROLL NO',
      defaultId: user.organizationId || 'ROLL-CS-2024-8819',
      defaultOrg: user.organizationName || 'Apex Institute of Technology & Research',
      defaultDept: user.department || 'Computer Science & Engineering',
      subtext: user.yearOrGrade || '3rd Year (Semester 6)'
    },
    company: {
      accent: 'from-emerald-400 via-teal-500 to-cyan-600',
      badgeBg: 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300',
      borderGlow: 'hover:shadow-emerald-500/20',
      title: 'CORPORATE WORKPLACE PASS',
      icon: Briefcase,
      idLabel: 'EMPLOYEE ID',
      defaultId: user.organizationId || 'EMP-NEX-4091',
      defaultOrg: user.organizationName || 'Nexus Global Enterprises Ltd.',
      defaultDept: user.department || 'Cafeteria & Workplace Welfare Board',
      subtext: user.yearOrGrade || 'Senior Engineer'
    },
    school: {
      accent: 'from-amber-400 via-orange-500 to-rose-600',
      badgeBg: 'bg-amber-950/60 border-amber-500/30 text-amber-300',
      borderGlow: 'hover:shadow-amber-500/20',
      title: 'ACADEMY PREFECT COUNCIL ID',
      icon: School,
      idLabel: 'ADMISSION NO',
      defaultId: user.organizationId || 'SCH-ADM-9941',
      defaultOrg: user.organizationName || 'Greenwood International Academy',
      defaultDept: user.house ? `${user.house} House` : 'Sapphire House',
      subtext: user.yearOrGrade || 'Grade 11 - Section A'
    },
    general: {
      accent: 'from-purple-500 via-indigo-600 to-blue-600',
      badgeBg: 'bg-purple-950/60 border-purple-500/30 text-purple-300',
      borderGlow: 'hover:shadow-purple-500/20',
      title: 'NATIONAL CIVIC VOTER IDENTITY',
      icon: Building,
      idLabel: 'VOTER ID / EPIC',
      defaultId: user.voterId || 'EPIC-MH-2026-8794',
      defaultOrg: user.organizationName || 'National Democratic Election Commission',
      defaultDept: user.department || 'Metropolitan Ward 42',
      subtext: user.phoneNumber || '+91 98765 43210'
    }
  };

  const currentTheme = themes[orgType] || themes.general;
  const DomainIcon = currentTheme.icon;

  return (
    <div className="perspective-1000 w-full flex justify-center py-4 select-none">
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: 'transform 0.15s ease-out'
        }}
        className={`relative w-full max-w-md bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl transition-shadow duration-300 overflow-hidden cursor-pointer ${currentTheme.borderGlow}`}
      >
        {/* Holographic dynamic rainbow sheen overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25 mix-blend-color-dodge transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.8) 0%, rgba(216,180,254,0.4) 25%, rgba(56,189,248,0.3) 50%, rgba(52,211,153,0) 80%)`
          }}
        />

        {/* Diagonal metallic holographic foil lines */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.08) 10px, rgba(255,255,255,0.08) 20px)'
          }}
        />

        {/* Card Header */}
        <div className="relative z-10 flex justify-between items-start mb-6 gap-2">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${currentTheme.accent} text-white shadow-lg shadow-purple-500/20`}>
              <DomainIcon className="h-5.5 w-5.5" />
            </div>
            <div>
              <p className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
                {currentTheme.title}
              </p>
              <h4 className="text-base font-extrabold text-white leading-tight mt-0.5">
                {currentTheme.defaultOrg}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-mono text-emerald-400 font-bold shadow-inner shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI SECURED
          </div>
        </div>

        {/* Cryptographic Smart Chip & RFID Sim */}
        <div className="relative z-10 flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            {/* Gold EMV Chip */}
            <div className="w-12 h-8.5 rounded-lg bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-200/60 p-1 flex flex-col justify-between shadow-md">
              <div className="w-full h-0.5 bg-amber-800/40 rounded-full" />
              <div className="w-full h-0.5 bg-amber-800/40 rounded-full" />
              <div className="w-full h-0.5 bg-amber-800/40 rounded-full" />
            </div>
            {/* Contactless / NFC Wave */}
            <div className="flex items-center gap-1 text-slate-500">
              <Cpu className="h-4.5 w-4.5 text-purple-400" />
              <span className="text-xs font-mono text-slate-400">NFC // WEB3</span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-0.5">{currentTheme.idLabel}</p>
            <p className="text-sm font-mono font-extrabold text-purple-300 tracking-wider bg-purple-950/60 px-2.5 py-1 rounded-md border border-purple-500/20">
              {currentTheme.defaultId}
            </p>
          </div>
        </div>

        {/* Voter Details */}
        <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-slate-800/80 pt-4 mb-4">
          <div className="col-span-2 space-y-1.5">
            <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">AUTHORIZED IDENTITY</p>
            <h3 className="text-lg font-extrabold text-white tracking-wide truncate">
              {user.name || 'Registered Voter'}
            </h3>
            <p className="text-sm text-slate-300 font-medium truncate">{currentTheme.defaultDept}</p>
            <p className="text-xs text-slate-400 font-mono">{currentTheme.subtext}</p>
          </div>

          {/* Biometric Verification Badge */}
          <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner">
            <Fingerprint className="h-8 w-8 text-emerald-400 animate-pulse mb-1.5" />
            <span className="text-[10px] font-mono text-emerald-300 uppercase font-bold tracking-tighter text-center leading-tight">
              BIOMETRICS 100% MATCH
            </span>
          </div>
        </div>

        {/* Card Footer: Wallet & Barcode */}
        <div className="relative z-10 border-t border-slate-800/80 pt-3.5 flex justify-between items-center text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-indigo-400" />
            <span>CONTRACT: 0x7a3B...21Bf</span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <QrCode className="h-4.5 w-4.5 text-purple-400" />
            <span>ETHEREUM LEDGER</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolographicIdBadge;
