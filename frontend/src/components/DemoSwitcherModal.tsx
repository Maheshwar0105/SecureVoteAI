import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { GraduationCap, Briefcase, School, Building, ShieldCheck, X, Sparkles, ArrowRight } from 'lucide-react';

interface DemoSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPersona: (user: any) => void;
}

export const DemoSwitcherModal: React.FC<DemoSwitcherModalProps> = ({
  isOpen,
  onClose,
  onSelectPersona
}) => {
  const navigate = useNavigate();
  const [loadingPersona, setLoadingPersona] = useState<string | null>(null);

  if (!isOpen) return null;

  const personas = [
    {
      id: 'college',
      title: 'College / University Student',
      subtitle: 'Roll No: ROLL-CS-2024-8819 | 3rd Year CSE',
      institution: 'Apex Institute of Technology & Research',
      department: 'Computer Science & AI Engineering',
      icon: GraduationCap,
      color: 'from-cyan-500 to-indigo-600',
      badge: 'Student Council & Mess Voting',
      description: 'Vote for Student Council President, Food & Mess Secretary, and Cultural Head with verified College Roll No.'
    },
    {
      id: 'company',
      title: 'Corporate Employee',
      subtitle: 'Employee ID: EMP-NEX-4091 | Senior Engineer',
      institution: 'Nexus Global Enterprise Ltd.',
      department: 'Cafeteria & Workplace Welfare Board',
      icon: Briefcase,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Food Dept & Workplace Governance',
      description: 'Vote for Cafeteria Food Quality Committee Lead, Menu Governance, and Workplace Culture Representatives.'
    },
    {
      id: 'school',
      title: 'School Senior Prefect',
      subtitle: 'Admission No: SCH-ADM-9941 | Grade 11-A',
      institution: 'Greenwood International Academy',
      department: 'Sapphire House Prefect Wing',
      icon: School,
      color: 'from-amber-500 to-rose-600',
      badge: 'Head Boy & Head Girl Ballot',
      description: 'Cast ballot for Head Boy, Head Girl, Sports Captain, and House Captains with admission roll authentication.'
    },
    {
      id: 'civic',
      title: 'Civic Citizen Voter',
      subtitle: 'EPIC ID: EPIC-MH-2026-8794 | Ward 42',
      institution: 'National Democratic Election Commission',
      department: 'Constituency 42 (Metropolitan)',
      icon: Building,
      color: 'from-purple-500 to-indigo-600',
      badge: 'General Legislative Assembly',
      description: 'National election ballot with verified Phone Number (+ OTP) and EPIC Voter ID ledger authentication.'
    },
    {
      id: 'admin',
      title: 'AI Election Commissioner',
      subtitle: 'Admin Clearance: Level 5 Superuser',
      institution: 'SecureVoteAI Decentralized Authority',
      department: 'Chief Election Commission & AI Security Ops',
      icon: ShieldCheck,
      color: 'from-fuchsia-600 to-purple-800',
      badge: 'Full Administrative Controls',
      description: 'Deploy new domain elections, configure candidate positions, monitor live AI anomaly fraud warnings.'
    }
  ];

  const handleSwitch = async (personaId: string) => {
    setLoadingPersona(personaId);
    try {
      const res = await api.post('/auth/demo-switch', { persona: personaId });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onSelectPersona(res.data.user);
      onClose();
      if (personaId === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Failed to switch persona:', err);
    } finally {
      setLoadingPersona(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Hologram Accent Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/20">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Live Presentation Persona Switcher</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Switch instantly between College, Corporate, School, Civic, and Admin roles.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Persona Cards Grid */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {personas.map((persona) => {
            const Icon = persona.icon;
            const isLoading = loadingPersona === persona.id;
            return (
              <div
                key={persona.id}
                onClick={() => !isLoading && handleSwitch(persona.id)}
                className="group relative bg-slate-950/70 border border-slate-800 hover:border-purple-500/60 rounded-2xl p-4 transition-all duration-200 cursor-pointer hover:bg-slate-850/50 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${persona.color} text-white shadow-md shrink-0`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-extrabold text-white text-sm group-hover:text-purple-300 transition">
                        {persona.title}
                      </h4>
                      <span className="text-[9px] font-mono font-bold bg-slate-900 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                        {persona.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">{persona.subtitle}</p>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{persona.description}</p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center">
                  <button
                    disabled={isLoading}
                    className="bg-purple-600/80 group-hover:bg-purple-500 text-white p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition shadow-md"
                  >
                    {isLoading ? (
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono">
          <span>SECUREVOTE AI // VIVA DEMONSTRATION ENGINE</span>
          <span className="text-emerald-400">100% SEED READY</span>
        </div>
      </div>
    </div>
  );
};

export default DemoSwitcherModal;
