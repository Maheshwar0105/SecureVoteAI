import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from './Badge';
import {
  GraduationCap,
  Briefcase,
  School,
  Building,
  CheckCircle2,
  X,
  Vote,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface VotingSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSelection: (domain: string, scheduleTime: string, targetElectionId?: string) => void;
  elections?: any[];
}

export const VotingSelectionModal: React.FC<VotingSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectSelection,
  elections = []
}) => {
  const navigate = useNavigate();

  const [selectedDomain, setSelectedDomain] = useState<'college' | 'school' | 'company' | 'civic'>('college');
  const [selectedTiming, setSelectedTiming] = useState<'now' | 'today_evening' | 'tomorrow' | 'weekend'>('now');
  const [selectedSubTopic, setSelectedSubTopic] = useState<string>('');

  if (!isOpen) return null;

  const domains = [
    {
      id: 'college',
      title: 'College / University Elections',
      icon: GraduationCap,
      badge: 'Student Council & Mess Voting',
      badgeVariant: 'teal' as const,
      color: 'from-teal-500 to-indigo-600',
      description: 'Vote for Student Council President, Food & Mess Secretary, Cultural Head, and CSE Dept Rep.',
      subTopics: [
        'Student Council President & Vice President',
        'Food & Mess Committee Governance',
        'Cultural & Sports Wing Lead',
        'Department Representative (CSE/ECE/Mech)'
      ]
    },
    {
      id: 'school',
      title: 'School Prefect Council',
      icon: School,
      badge: 'Head Boy & Head Girl Ballot',
      badgeVariant: 'warning' as const,
      color: 'from-amber-500 to-rose-600',
      description: 'Vote for Head Boy, Head Girl, Sports Captain, and House Captains (Ruby, Sapphire, Emerald).',
      subTopics: [
        'Head Boy & Head Girl (Grade 11 & 12)',
        'Sports Captain & Athletics Board',
        'House Prefect (Ruby / Sapphire / Emerald / Topaz)',
        'Discipline & Cultural Prefects'
      ]
    },
    {
      id: 'company',
      title: 'Corporate Workplace Governance',
      icon: Briefcase,
      badge: 'Food Dept & Workplace Board',
      badgeVariant: 'success' as const,
      color: 'from-emerald-500 to-teal-600',
      description: 'Vote for Cafeteria Food Quality Lead, Menu Governance, and Workplace Welfare Committee.',
      subTopics: [
        'Cafeteria Menu & Food Quality Lead',
        'Workplace Culture & Wellness Rep',
        'Employee Welfare Board Member',
        'CSR & Ethics Committee Representative'
      ]
    },
    {
      id: 'civic',
      title: 'Official Civic Elections of India',
      icon: Building,
      badge: 'National & Legislative Assembly',
      badgeVariant: 'primary' as const,
      color: 'from-purple-500 to-indigo-600',
      description: 'Official voter poll with EPIC ID + SMS OTP verification for National Legislative Assembly.',
      subTopics: [
        'National Legislative Assembly (Metropolitan Ward 42)',
        'Municipal Corporation & Local Governance',
        'Public Policy & Civic Development Referendum',
        'District Electoral Council'
      ]
    }
  ];

  const timingOptions = [
    { id: 'now', label: 'Vote Right Now (Live Ballot)', tag: '🟢 Live Poll Open', tagVariant: 'success' as const, desc: 'Cast vote immediately on Sepolia smart contract' },
    { id: 'today_evening', label: 'Today Evening (6:00 PM - 9:00 PM)', tag: '⏰ Scheduled Today', tagVariant: 'info' as const, desc: 'Reserve voting slot for this evening' },
    { id: 'tomorrow', label: 'Tomorrow Morning (10:00 AM)', tag: '📅 Scheduled Tomorrow', tagVariant: 'warning' as const, desc: 'Set automated voting reminder for tomorrow' },
    { id: 'weekend', label: 'Upcoming Weekend (Saturday 11 AM)', tag: '🗓️ Weekend Slot', tagVariant: 'primary' as const, desc: 'Vote during designated weekend poll window' }
  ];

  const activeDomainObj = domains.find((d) => d.id === selectedDomain) || domains[0];

  const matchingElection = elections.find(
    (e) => e.type === selectedDomain || (selectedDomain === 'civic' && e.type === 'general')
  );

  const handleConfirm = () => {
    onSelectSelection(selectedDomain, selectedTiming, matchingElection?._id);
    onClose();

    if (selectedTiming === 'now' && matchingElection?._id) {
      navigate(`/elections/${matchingElection._id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-lg animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Modal Header */}
        <div className="flex justify-between items-start mb-5 pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-teal-600 text-white shadow-lg">
              <Vote className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Badge variant="success" dot size="sm">
                  POST-LOGIN ELECTION SELECTION GATEWAY
                </Badge>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                What & When Do You Want to Vote For?
              </h2>
              <p className="text-xs text-slate-300">
                Select your institution, voting position, and preferred timing slot to begin.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="space-y-6 overflow-y-auto pr-1 flex-1">
          {/* STEP 1: Select Institution / Voting Category */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2 font-mono">
              <span className="h-5 w-5 rounded-full bg-purple-600 text-white text-[11px] flex items-center justify-center font-mono">1</span>
              <span>Select Voting Institution / Category</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {domains.map((dom) => {
                const Icon = dom.icon;
                const isSelected = selectedDomain === dom.id;
                return (
                  <div
                    key={dom.id}
                    onClick={() => {
                      setSelectedDomain(dom.id as any);
                      setSelectedSubTopic('');
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-slate-900 border-purple-500 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/50'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${dom.color} text-white shadow-md`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant={dom.badgeVariant} size="sm">
                        {dom.badge}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-sm">{dom.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-snug mt-1">{dom.description}</p>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-purple-400 font-bold">
                      <span>{isSelected ? '✓ SELECTED' : 'CLICK TO SELECT'}</span>
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Select Specific Target Position / Topic */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-2 font-mono">
              <span className="h-5 w-5 rounded-full bg-teal-600 text-white text-[11px] flex items-center justify-center font-mono">2</span>
              <span>Select Specific Position / Ballot Topic</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeDomainObj.subTopics.map((topic, idx) => {
                const isTopicSelected = selectedSubTopic === topic || (!selectedSubTopic && idx === 0);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedSubTopic(topic)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition flex items-center justify-between gap-2 cursor-pointer ${
                      isTopicSelected
                        ? 'bg-purple-950/60 border-purple-500/60 text-white shadow-sm'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <span>{topic}</span>
                    {isTopicSelected && <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Select Timing Slot */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2 font-mono">
              <span className="h-5 w-5 rounded-full bg-emerald-600 text-white text-[11px] flex items-center justify-center font-mono">3</span>
              <span>Select Voting Time Slot</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {timingOptions.map((opt) => {
                const isSelected = selectedTiming === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedTiming(opt.id as any)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex justify-between items-center ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/60 ring-1 ring-emerald-500/40'
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h5 className="text-xs font-bold text-white">{opt.label}</h5>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">{opt.desc}</p>
                    </div>
                    <Badge variant={opt.tagVariant} size="sm">
                      {opt.tag}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer / Action CTA */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Cryptographic Sepolia Smart Contract Ballot Active</span>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-850 text-xs font-bold transition cursor-pointer"
            >
              Skip For Now
            </button>
            
            <button
              onClick={handleConfirm}
              className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-600 hover:from-purple-500 hover:to-teal-500 text-white text-xs font-bold transition shadow-lg shadow-purple-500/20 cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <span>{selectedTiming === 'now' ? 'Proceed to Cast Vote Now' : 'Save Preferred Vote Slot'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingSelectionModal;
