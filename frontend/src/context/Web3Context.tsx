import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface Web3ContextType {
  account: string | null;
  chainId: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<string | null>;
  disconnectWallet: () => void;
  signChallenge: (challenge: string) => Promise<string | null>;
  switchNetwork: (targetChainId: string) => Promise<boolean>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          const provider = new ethers.BrowserProvider((window as any).ethereum);
          const accounts = await provider.send('eth_accounts', []);
          const network = await provider.getNetwork();
          
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setChainId(network.chainId.toString());
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkIfWalletIsConnected();

    // Listen to changes
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });

      (window as any).ethereum.on('chainChanged', (hexChainId: string) => {
        setChainId(parseInt(hexChainId, 16).toString());
      });
    }

    return () => {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        (window as any).ethereum.removeAllListeners('accountsChanged');
        (window as any).ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const connectWallet = async (): Promise<string | null> => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      alert('MetaMask is not installed. Please install MetaMask to use this DApp.');
      return null;
    }

    setIsConnecting(true);
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const network = await provider.getNetwork();

      setAccount(accounts[0]);
      setChainId(network.chainId.toString());
      setIsConnecting(false);
      return accounts[0];
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setIsConnecting(false);
      return null;
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
  };

  const signChallenge = async (challenge: string): Promise<string | null> => {
    if (typeof window === 'undefined' || !(window as any).ethereum || !account) {
      console.error('Ethereum provider or connected account not found');
      return null;
    }

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(challenge);
      return signature;
    } catch (error) {
      console.error('Message signing failed:', error);
      return null;
    }
  };

  const switchNetwork = async (targetChainId: string): Promise<boolean> => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      return false;
    }

    const hexChainId = '0x' + parseInt(targetChainId).toString(16);

    try {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      });
      return true;
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          if (targetChainId === '11155111') { // Sepolia Testnet
            await (window as any).ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: hexChainId,
                  chainName: 'Sepolia Test Network',
                  nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
                  rpcUrls: ['https://sepolia.infura.io/v3/'],
                  blockExplorerUrls: ['https://sepolia.etherscan.io'],
                },
              ],
            });
            return true;
          }
        } catch (addError) {
          console.error('Error adding network to MetaMask:', addError);
        }
      }
      console.error('Failed to switch network:', switchError);
      return false;
    }
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        chainId,
        isConnected: !!account,
        isConnecting,
        connectWallet,
        disconnectWallet,
        signChallenge,
        switchNetwork,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
