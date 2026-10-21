import React from 'react';
import { Link } from 'react-router-dom';
import Badge from './Badge';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12 px-6 lg:px-12" dir="ltr">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Title & Academic Capstone Info */}
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-purple-400" />
            <h3 className="text-white font-extrabold text-xl tracking-wider">SecureVoteAI</h3>
          </div>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            Auditable capstone project combining Ethereum smart contracts, Python AI anomaly detection, and facial biometrics for multi-tenant voting security.
          </p>
          <div className="text-[11px] text-slate-500 font-mono space-y-0.5">
            <p>© {new Date().getFullYear()} SecureVoteAI. Final Year B.Tech Capstone Project.</p>
            <p className="text-purple-400 font-semibold">Netlify (Frontend) + Render (Backend API)</p>
          </div>
        </div>

        {/* Center Column: Smart Contract Address */}
        <div className="space-y-3 text-left">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">Verified Smart Contract</h4>
          <div className="space-y-2 text-xs">
            <div className="text-slate-500 font-mono">Ethereum Sepolia Testnet:</div>
            <a 
              href="https://sepolia.etherscan.io/address/0x73Cf76b9dfaFdD8E09735dDC21Bf27CdDbf77080" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-mono text-purple-400 hover:text-purple-300 hover:underline break-all flex items-center gap-1.5"
            >
              <span>0x73Cf76b9dfaFdD8E09735dDC21Bf27CdDbf77080</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
            <div className="pt-1 flex flex-wrap gap-2">
              <Badge variant="primary" size="sm">
                VotingSystem.sol
              </Badge>
              <Badge variant="success" size="sm" dot>
                Verified On-Chain
              </Badge>
            </div>
          </div>
        </div>

        {/* Right Column: Active Navigation & Evaluator Documentation */}
        <div className="space-y-3 text-left">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">Navigation & Architecture</h4>
          <ul className="space-y-2 text-xs font-medium">
            <li>
              <Link to="/" className="hover:text-purple-300 transition flex items-center gap-1.5">
                <span>• Home Page</span>
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-purple-300 transition flex items-center gap-1.5">
                <span>• Tech Stack & Architecture Specs</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-purple-300 transition flex items-center gap-1.5">
                <span>• Multi-Tenant Voting Portal</span>
              </Link>
            </li>
            <li>
              <Link to="/results" className="hover:text-purple-300 transition flex items-center gap-1.5">
                <span>• Live Audit Results & Ledger Logs</span>
              </Link>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
