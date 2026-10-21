import React from 'react';
import Modal from './Modal';
import { Wallet, ExternalLink } from 'lucide-react';

interface MetaMaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MetaMaskModal: React.FC<MetaMaskModalProps> = ({ isOpen, onClose }) => {
  const handleInstall = () => {
    window.open('https://metamask.io/download/', '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="MetaMask Extension Required" size="md">
      <div className="flex flex-col gap-5">
        {/* Icon row */}
        <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
          <div
            className="flex items-center justify-center h-12 w-12 rounded-xl shrink-0"
            style={{ background: 'rgba(var(--rgb-primary), 0.12)', color: 'var(--color-primary)' }}
          >
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              MetaMask is not detected
            </p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              To use blockchain-based wallet login, you need the MetaMask browser extension installed and active.
            </p>
          </div>
        </div>

        {/* Steps */}
        <ol className="space-y-2 list-none">
          {[
            'Visit metamask.io and click "Download"',
            'Add MetaMask to your browser as an extension',
            'Create or import a wallet, then return here',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <span
                className="flex items-center justify-center h-5 w-5 rounded-full text-xs font-bold shrink-0 mt-0.5"
                style={{ background: 'var(--color-primary)', color: '#fff' }}
              >
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            id="metamask-install-btn"
            onClick={handleInstall}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm cursor-pointer transition"
            style={{ background: 'var(--color-primary)', color: '#fff' }}
          >
            <ExternalLink className="h-4 w-4" />
            Install MetaMask
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm cursor-pointer transition border"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)', background: 'transparent' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MetaMaskModal;
