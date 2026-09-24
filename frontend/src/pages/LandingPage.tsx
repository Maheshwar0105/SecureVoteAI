import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Futuristic3DCanvas from '../components/Futuristic3DCanvas';
import HolographicIdBadge from '../components/HolographicIdBadge';
import AIAnomalyRadar from '../components/AIAnomalyRadar';
import DemoSwitcherModal from '../components/DemoSwitcherModal';
import Card, { CardContent } from '../components/Card';
import Badge from '../components/Badge';
import {
  ShieldAlert,
  Cpu,
  ChevronDown,
  CheckCircle,
  GraduationCap,
  Briefcase,
  School,
  Building,
  Sparkles,
  Fingerprint,
  ArrowRight,
  Vote,
  Layers
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeDomainTab, setActiveDomainTab] = useState<'college' | 'company' | 'school' | 'civic'>('college');
  const [showDemoModal, setShowDemoModal] = useState(false);

  const stats = [
    { label: 'Immutable On-Chain Ballots', value: '45,892+' },
    { label: 'Multi-Tenant Institutions', value: '184' },
    { label: 'AI Anomaly Detection Rate', value: '99.98%' },
    { label: 'Consensus Block Latency', value: '< 1.4s' }
  ];

  const domainFeatures = {
    college: {
      title: 'College & University Student Elections',
      tag: 'CAMPUS DEMOCRACY SUITE',
      icon: GraduationCap,
      badgeVariant: 'teal' as const,
      description: 'Empower student bodies to conduct tamper-proof elections for Student Council Presidents, Mess & Food Committees, Cultural Heads, and Department Representatives using verified Student Roll Numbers and College IDs.',
      bullets: [
        'Roll Number & Department verification (CSE, ECE, Mech, MBA, Biotech)',
        'Multi-portfolio ballot: President, Vice President, Food & Mess Secretary',
        'Anti-proxy live facial biometric verification directly via webcam',
        'Transparent budget allocations and council pledges permanently logged'
      ],
      sampleUser: {
        name: 'Aarav Sharma',
        email: 'aarav.cs24@apex-tech.edu',
        organizationType: 'college' as const,
        organizationId: 'ROLL-CS-2024-8819',
        organizationName: 'Apex Institute of Technology & Research',
        department: 'Computer Science & AI Engineering',
        yearOrGrade: '3rd Year (Semester 6)',
        role: 'voter'
      }
    },
    company: {
      title: 'Corporate Workplace & Cafeteria Governance',
      tag: 'ENTERPRISE BALLOT ENGINE',
      icon: Briefcase,
      badgeVariant: 'success' as const,
      description: 'Streamline internal enterprise decision-making, Cafeteria Menu Governance, Food Quality Committees, Workplace Culture representatives, and Employee Welfare Boards with Employee ID authentication.',
      bullets: [
        'Corporate Single Sign-On (SSO) & Employee ID credential binding',
        'Cafeteria Food Quality Committee & Menu Representative voting',
        'Zero-knowledge anonymized voting to ensure genuine employee feedback',
        'Auditable corporate governance ledger compliant with privacy standards'
      ],
      sampleUser: {
        name: 'Priya Mukherjee',
        email: 'priya.m@nexusglobal.com',
        phoneNumber: '+91 94120 77632',
        organizationType: 'company' as const,
        organizationId: 'EMP-NEX-4091',
        organizationName: 'Nexus Global Enterprise Ltd.',
        department: 'Cafeteria & Workplace Welfare Board',
        yearOrGrade: 'Senior Engineer',
        role: 'voter'
      }
    },
    school: {
      title: 'School Prefect & House Council Elections',
      tag: 'K-12 LEADERSHIP PLATFORM',
      icon: School,
      badgeVariant: 'warning' as const,
      description: 'Provide young scholars with hands-on experience in modern decentralized democracy by voting for Head Boy, Head Girl, Sports Captains, and House Prefects (Ruby, Sapphire, Emerald, Topaz).',
      bullets: [
        'Admission Number and House affiliation authentication',
        'Contested dual leadership slots: Head Boy, Head Girl, Sports Captain',
        'Gamified civic learning with tamper-proof blockchain audit proofs',
        'Automated real-time result tabulation with instant victory certificates'
      ],
      sampleUser: {
        name: 'Rohan Verma',
        email: 'rohan.v@greenwood-academy.edu',
        phoneNumber: '+91 98111 22334',
        organizationType: 'school' as const,
        organizationId: 'SCH-ADM-9941',
        organizationName: 'Greenwood International Academy',
        department: 'Sapphire House Prefect Wing',
        yearOrGrade: 'Grade 11 - Section A',
        house: 'Sapphire',
        role: 'voter'
      }
    },
    civic: {
      title: 'National & Civic Legislative Elections',
      tag: 'GOVERNMENT GRADE EVM DAPP',
      icon: Building,
      badgeVariant: 'primary' as const,
      description: 'End-to-end verifiable nationwide electoral framework integrating EPIC Voter IDs, SMS OTP multi-factor authentication, Ethereum smart contracts, and real-time Isolation Forest AI anomaly threat monitors.',
      bullets: [
        'National EPIC Voter ID + Registered Mobile Number (+ SMS OTP)',
        'Solidity-based smart contract ballot immutability on Sepolia',
        'AI real-time bot, proxy, and Sybil attack isolation forest scanner',
        'Public zero-trust cryptographic audit trail viewable by any citizen'
      ],
      sampleUser: {
        name: 'Devendra Patil',
        email: 'devendra.patil@civicnet.gov.in',
        phoneNumber: '+91 97654 32109',
        voterId: 'EPIC-MH-2026-8794',
        organizationType: 'general' as const,
        organizationId: 'WARD-SEC-402',
        organizationName: 'National Democratic Election Commission',
        department: 'Constituency 42 (Metropolitan)',
        role: 'voter'
      }
    }
  };

  const currentDomain = domainFeatures[activeDomainTab];

  const faqs = [
    {
      q: 'How does the platform adapt to Colleges, Companies, Schools, and Civic Elections?',
      a: 'SecureVoteAI is multi-tenant by design. Administrators can configure elections for College Student Councils (Roll Numbers, Departments), Corporate Governance (Employee IDs, Cafeteria/Food committees), Schools (Admission No, Head Boy/Girl), or National Civic polls (Voter ID/EPIC, Phone OTP).'
    },
    {
      q: 'How does blockchain guarantee that votes cannot be altered?',
      a: 'Votes are registered directly as smart contract transactions on the Ethereum distributed ledger. Once written, the cryptographic data is immutable, timestamped, and mathematically verifiable across decentralized nodes.'
    },
    {
      q: 'What role does AI play in voter security and anomaly detection?',
      a: 'Our Python machine learning engine runs an Isolation Forest model that continuously evaluates client device fingerprints, click cadence, IP routing, and timing intervals to detect bot manipulation or duplicate voting attempts in real time.'
    },
    {
      q: 'How does live biometric face verification prevent proxy voting?',
      a: 'The system utilizes deep learning 128-dimensional facial embeddings with liveness checking. Before casting a ballot, the voter webcam performs a real-time Euclidean distance match against their registered biometric baseline.'
    }
  ];

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col justify-start bg-grid relative overflow-hidden" dir="ltr">

      {/* Hero Section */}
      <section className="relative pt-6 pb-12 lg:pt-8 lg:pb-16 px-4 sm:px-6 lg:px-8 w-full max-w-[1400px] mx-auto overflow-hidden">
        {/* Background Artwork Layer */}
        <div className="absolute inset-0 -z-10 rounded-3xl overflow-hidden opacity-35 pointer-events-none">
          <img 
            src="/securevote_hero_bg.png" 
            alt="SecureVote AI Background" 
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = '/secure_voting_command.png';
            }}
            className="w-full h-full object-cover object-center scale-105 filter contrast-125 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80" />
        </div>

        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/15 to-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Left Column: Headline & CTA */}
          <div className="lg:col-span-7 text-left space-y-5 animate-fade-in">
            <Badge variant="primary" icon={Sparkles}>
              NEXT-GEN AI & BLOCKCHAIN VOTING INFRASTRUCTURE
            </Badge>

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
                The Future of{' '}
                <span className="bg-gradient-to-r from-teal-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  Secure Voting
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-teal-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent mt-2.5 tracking-tight">
                Built with AI. Secured by Blockchain.
              </p>
            </div>

            <p className="body-base max-w-xl">
              One unified platform for <strong className="text-teal-300">College Student Councils</strong>, <strong className="text-emerald-300">Corporate Workplace & Food Depts</strong>, <strong className="text-amber-300">School Prefects</strong>, and <strong className="text-purple-300">Civic Elections</strong>—powered by Ethereum smart contracts, real-time AI anomaly detection, and biometric face verification.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-600 hover:from-purple-500 hover:to-teal-500 text-white font-bold px-8 py-3.5 rounded-xl transition shadow-lg shadow-purple-500/25 active:scale-95 cursor-pointer flex items-center gap-2 text-sm"
              >
                <Vote className="h-4 w-4" />
                <span>Cast Your Vote</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setShowDemoModal(true)}
                className="bg-slate-900 border border-slate-700 hover:border-purple-500/50 hover:bg-slate-850 text-slate-200 font-bold px-6 py-3.5 rounded-xl transition active:scale-95 cursor-pointer flex items-center gap-2 text-sm shadow-md"
              >
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span>Live Viva Demo</span>
              </button>
            </div>

            {/* Quick credentials chip row */}
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-slate-400">
              <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">🎓 Student Roll ID</span>
              <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">🏢 Corporate Emp ID</span>
              <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">🏫 School Admission No</span>
              <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">🏛️ National Voter EPIC</span>
            </div>
          </div>

          {/* Right Column: 3D Holographic Canvas Container */}
          <div className="lg:col-span-5 relative">
            <Card className="min-h-[420px] flex flex-col justify-between p-3">
              {/* Interactive 3D Node Mesh */}
              <Futuristic3DCanvas />

              {/* Status footer bar inside canvas */}
              <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-xl flex justify-between items-center text-[10px] font-mono text-slate-400">
                <Badge variant="success" dot size="sm">
                  SMART CONTRACT 0x7a3B... ONLINE
                </Badge>
                <span>ISOLATION FOREST RISK: 0.02</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="bg-slate-900/40 border-y border-slate-800/80 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => (
            <Card key={idx} interactive className="p-5 text-center">
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">{stat.value}</p>
              <p className="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">{stat.label}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Interactive Multi-Domain Ecosystem Explorer */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <Badge variant="primary" icon={Layers} className="mb-3">
            MULTI-TENANT ELECTORAL ADAPTATION
          </Badge>
          <h2 className="heading-lg">
            Custom Tailored for Every Institution
          </h2>
          <p className="body-base max-w-2xl mx-auto mt-2">
            Experience how SecureVoteAI customizes identity models, ballots, and candidate profiles for each specific domain.
          </p>
        </div>

        {/* Domain Selection Tabs */}
        <div className="flex justify-center flex-wrap gap-2 sm:gap-4 mb-10">
          {[
            { id: 'college', label: 'College & Universities', icon: GraduationCap },
            { id: 'company', label: 'Corporate & Food Dept', icon: Briefcase },
            { id: 'school', label: 'School Prefect Councils', icon: School },
            { id: 'civic', label: 'National & Civic Polls', icon: Building }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeDomainTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDomainTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20 scale-105 border border-purple-400/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Domain Detail View */}
        <Card className="p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Domain Explanation & Features */}
            <div className="lg:col-span-7 space-y-6">
              <Badge variant={currentDomain.badgeVariant} icon={currentDomain.icon}>
                {currentDomain.tag}
              </Badge>

              <h3 className="heading-md text-2xl sm:text-3xl">
                {currentDomain.title}
              </h3>

              <p className="body-base">
                {currentDomain.description}
              </p>

              <div className="space-y-3 pt-2">
                {currentDomain.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl transition cursor-pointer shadow-md"
                >
                  Register For This Domain
                </button>
                <button
                  onClick={() => setShowDemoModal(true)}
                  className="bg-slate-950 border border-slate-800 hover:bg-slate-850 text-slate-300 text-xs sm:text-sm font-bold px-6 py-3 rounded-xl transition cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span>Try Live Persona</span>
                </button>
              </div>
            </div>

            {/* 3D Holographic Identity Badge for this domain */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">
                INTERACTIVE 3D HOLOGRAPHIC SMART PASS (MOVE MOUSE)
              </p>
              <HolographicIdBadge user={currentDomain.sampleUser} />
            </div>
          </div>
        </Card>
      </section>

      {/* Real-time AI Radar & Security Architecture */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Security Overview */}
          <div className="lg:col-span-6 space-y-6">
            <Badge variant="teal" icon={ShieldAlert}>
              AI FRAUD & SYBIL DEFENSE MATRIX
            </Badge>

            <h2 className="heading-lg">
              Zero-Trust Architecture with Real-Time AI Sentinel
            </h2>

            <p className="body-base">
              While traditional electronic voting machines are vulnerable to physical tampering and centralized databases can be manipulated, SecureVoteAI unites zero-trust Ethereum smart contracts with a real-time machine learning isolation forest scanner.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Card className="p-4">
                <Cpu className="h-6 w-6 text-teal-400 mb-2" />
                <h4 className="font-bold text-white text-sm">Python ML Anomaly Engine</h4>
                <p className="text-slate-400 text-xs mt-1">Calculates multidimensional risk scores on timing intervals, click telemetry, and request volumes.</p>
              </Card>

              <Card className="p-4">
                <Fingerprint className="h-6 w-6 text-emerald-400 mb-2" />
                <h4 className="font-bold text-white text-sm">Deep Biometric Liveness</h4>
                <p className="text-slate-400 text-xs mt-1">Extracts 128-d face descriptors to ensure only registered physical voters cast authorized votes.</p>
              </Card>
            </div>
          </div>

          {/* AI Anomaly Radar Component */}
          <div className="lg:col-span-6">
            <AIAnomalyRadar />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-900/20 border-t border-slate-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-lg text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="p-0 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-6 text-left font-semibold text-white hover:bg-slate-800/40 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-6 pt-0 text-slate-400 text-sm border-t border-slate-800/80 leading-relaxed bg-slate-950/20">
                    {faq.a}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Modal for Persona Switch */}
      <DemoSwitcherModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        onSelectPersona={() => {
          navigate('/dashboard');
        }}
      />
    </div>
  );
};

export default LandingPage;
