import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 px-6 lg:px-12" dir="ltr">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Title and details */}
        <div className="space-y-4 text-left">
          <div>
            <h3 className="text-white font-black text-xl tracking-wider">SecureVoteAI</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
              Decentralized, Smart Contract-driven, and Anomaly-safe voting ecosystem for secure digital democracy.
            </p>
          </div>
          <div className="text-[11px] text-slate-600">
            <p>© {new Date().getFullYear()} SecureVoteAI. All rights reserved.</p>
            <p className="mt-0.5">Developed as a final year B.Tech Capstone Project.</p>
          </div>
        </div>

        {/* Center Column: Smart Contract Address */}
        <div className="space-y-3 text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Verified Smart Contract</h4>
          <div className="space-y-1.5 text-xs">
            <div className="text-slate-500">Sepolia Ethereum Testnet:</div>
            <a 
              href="https://sepolia.etherscan.io/address/0x73Cf76b9dfaFdD8E09735dDC21Bf27CdDbf77080" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-mono text-purple-400 hover:text-purple-300 hover:underline break-all block"
            >
              0x73Cf76b9dfaFdD8E09735dDC21Bf27CdDbf77080
            </a>
            <span className="inline-flex items-center gap-1 bg-purple-950/40 border border-purple-500/30 text-[9px] font-semibold text-purple-300 px-2 py-0.5 rounded-full mt-1">
              Active VotingSystem.sol
            </span>
          </div>
        </div>

        {/* Right Column: Help & Support Links */}
        <div className="space-y-3 text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Help & Documentation</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="/documentation/Capstone_Project_Report.md" className="hover:text-white transition">
                User manual & Guide
              </a>
            </li>
            <li>
              <a href="/documentation/Capstone_Project_Report.md" className="hover:text-white transition">
                Developer API reference
              </a>
            </li>
            <li>
              <a href="/documentation/Capstone_Project_Report.md" className="hover:text-white transition">
                System architecture reports
              </a>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
