import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Badge from '../components/Badge';
import {
  ShieldCheck,
  Cpu,
  Database,
  Layers,
  GraduationCap,
  Briefcase,
  School,
  Building,
  CheckCircle,
  ExternalLink,
  Code2,
  Lock,
  ArrowRight,
  Globe,
  Terminal,
  Sparkles
} from 'lucide-react';

export const About: React.FC = () => {
  const navigate = useNavigate();

  const techStack = [
    {
      category: 'Frontend DApp Layer',
      badge: 'Netlify Deployed',
      badgeVariant: 'teal' as const,
      icon: Code2,
      techs: ['React 18', 'TypeScript', 'Vite', 'TailwindCSS', 'Three.js (3D Hologram Mesh)', 'Lucide Icons', 'Chart.js'],
      description: 'Single-page application delivering sub-second tab switching, glassmorphism UI components, dynamic multi-tenant domain customization, and interactive 3D WebGL passes.'
    },
    {
      category: 'Backend & ML Anomaly Sentinel',
      badge: 'Render Deployed',
      badgeVariant: 'success' as const,
      icon: Cpu,
      techs: ['Node.js', 'Express.js REST API', 'Python ML Engine', 'Scikit-Learn Isolation Forest', 'Face-API.js (128-d Vector Match)', 'JWT Auth'],
      description: 'Asynchronous API backend processing multi-factor identity credentials, click telemetry cadence anomaly scoring, and facial biometric liveness verification.'
    },
    {
      category: 'Blockchain Ledger Layer',
      badge: 'Sepolia Ethereum Testnet',
      badgeVariant: 'primary' as const,
      icon: Database,
      techs: ['Solidity (EVM)', 'Hardhat Framework', 'Ethers.js v6', 'MetaMask Integration', 'Smart Contract: VotingSystem.sol'],
      description: 'Immutable smart contract deployment ensuring tamper-proof ballot storage, zero-trust transaction verification, and public auditability for every vote.'
    }
  ];

  const domainMatrix = [
    {
      domain: 'College & Universities',
      icon: GraduationCap,
      idField: 'Student Roll Number (e.g. ROLL-CS-2024-8819)',
      ballotTypes: 'Student Council President, Vice President, Food & Mess Secretary',
      verification: 'Department + Roll No + Facial Liveness Verification'
    },
    {
      domain: 'Corporate Workplace',
      icon: Briefcase,
      idField: 'Corporate Employee ID (e.g. EMP-NEX-4091)',
      ballotTypes: 'Cafeteria Food Quality Lead, Menu Governance, Welfare Board',
      verification: 'SSO Credential + Anonymized Employee Token'
    },
    {
      domain: 'School Prefect Councils',
      icon: School,
      idField: 'Admission Number (e.g. SCH-ADM-9941)',
      ballotTypes: 'Head Boy, Head Girl, Sports Captain, House Prefects',
      verification: 'Admission Roll + House Affiliation Authentication'
    },
    {
      domain: 'National & Civic Polls',
      icon: Building,
      idField: 'EPIC Voter ID (e.g. EPIC-MH-2026-8794)',
      ballotTypes: 'Legislative Assembly, Municipal Ward Representative',
      verification: 'Voter ID + Phone OTP Multi-Factor Authentication'
    }
  ];

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-12 w-full max-w-7xl mx-auto space-y-12">
      
      {/* Header Banner */}
      <div className="text-center space-y-4 pt-4">
        <Badge variant="teal" icon={Sparkles}>
          CAPSTONE PROJECT SPECIFICATIONS & ARCHITECTURE REPORT
        </Badge>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          SecureVoteAI System Architecture
        </h1>

        <p className="body-base max-w-3xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed">
          An auditable, multi-tenant decentralized voting ecosystem designed for academic evaluation. Built to resolve traditional electronic voting machine (EVM) vulnerabilities through Ethereum smart contracts, Python AI anomaly detection, and facial biometrics.
        </p>
      </div>

      {/* Deployment & Tech Stack Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <h2 className="heading-md flex items-center gap-2">
            <Layers className="h-5 w-5 text-purple-400" />
            <span>Technology Stack & Deployment Architecture</span>
          </h2>
          <Badge variant="primary" size="sm">
            Netlify + Render Infrastructure
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {techStack.map((tier, idx) => {
            const Icon = tier.icon;
            return (
              <Card key={idx} className="p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-purple-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant={tier.badgeVariant} size="sm font-mono">
                      {tier.badge}
                    </Badge>
                  </div>

                  <h3 className="font-extrabold text-white text-lg mb-2">
                    {tier.category}
                  </h3>

                  <p className="text-slate-400 text-xs leading-relaxed mb-4">
                    {tier.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {tier.techs.map((t, i) => (
                      <span key={i} className="bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg text-[11px] font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Multi-Tenant Adaptation Matrix */}
      <section className="space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="heading-md flex items-center gap-2">
            <Globe className="h-5 w-5 text-teal-400" />
            <span>Multi-Tenant Domain Schema Matrix</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            How identity credentials, ballot categories, and verification pipelines dynamically adapt across institutional domains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {domainMatrix.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{item.domain}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">Domain Identifier Model</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-2">
                  <div className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold font-mono shrink-0">Credential ID:</span>
                    <span className="text-slate-300 font-mono">{item.idField}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold font-mono shrink-0">Ballot Positions:</span>
                    <span className="text-slate-300">{item.ballotTypes}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold font-mono shrink-0">Auth Constraint:</span>
                    <span className="text-slate-300">{item.verification}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Smart Contract Verification Specs */}
      <section className="space-y-6">
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
            <div>
              <Badge variant="success" icon={Lock} className="mb-1">
                VERIFIED SMART CONTRACT LEDGER
              </Badge>
              <h2 className="heading-md">Solidity Contract Specifications</h2>
            </div>

            <a
              href="https://sepolia.etherscan.io/address/0x73Cf76b9dfaFdD8E09735dDC21Bf27CdDbf77080"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 border border-purple-500/40 hover:bg-slate-850 text-purple-300 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 font-mono shadow-md"
            >
              <span>View On Sepolia Etherscan</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <p className="text-slate-400 uppercase font-semibold">Contract Address:</p>
              <p className="text-emerald-400 font-bold break-all">0x73Cf76b9dfaFdD8E09735dDC21Bf27CdDbf77080</p>
              <p className="text-slate-400 uppercase font-semibold pt-2">Network Environment:</p>
              <p className="text-slate-200">Ethereum Sepolia Testnet (Chain ID 11155111)</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <p className="text-slate-400 uppercase font-semibold">Key Functions Implemented:</p>
              <ul className="space-y-1 text-slate-300">
                <li className="flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-purple-400" />
                  <code>createElection(string title, string[] positions)</code>
                </li>
                <li className="flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-teal-400" />
                  <code>castVote(bytes32 candidateHash, bytes signature)</code>
                </li>
                <li className="flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                  <code>getResults(uint256 electionId)</code>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </section>

      {/* Evaluator Actions Footer Bar */}
      <Card className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-purple-950/40 via-slate-900 to-teal-950/40">
        <div>
          <h3 className="font-extrabold text-white text-base">Ready for Evaluator Testing?</h3>
          <p className="text-xs text-slate-400 mt-0.5">Explore voting workflow or switch simulated institutional personas in Demo Mode.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-md"
          >
            <span>Open Voting Portal</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate('/results')}
            className="bg-slate-900 border border-slate-700 hover:bg-slate-850 text-slate-300 text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer"
          >
            Audit Live Results
          </button>
        </div>
      </Card>

    </div>
  );
};

export default About;
