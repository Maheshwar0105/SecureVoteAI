import { ethers } from 'ethers';
import { DEFAULT_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI } from '../config/contract';

export interface VoteReceipt {
  hash: string;
  blockNumber: number;
  from: string;
  gasUsed: string;
}

export const getContractInstance = async (withSigner: boolean = false) => {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    throw new Error('MetaMask is not installed or available in browser.');
  }

  const provider = new ethers.BrowserProvider((window as any).ethereum);

  if (withSigner) {
    const signer = await provider.getSigner();
    return new ethers.Contract(DEFAULT_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, signer);
  }

  return new ethers.Contract(DEFAULT_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, provider);
};

export const castVoteOnChain = async (
  electionNumericId: number,
  candidateNumericId: number
): Promise<VoteReceipt> => {
  const contract = await getContractInstance(true);

  // Send transaction to Ethereum network via MetaMask
  const tx = await contract.vote(electionNumericId, candidateNumericId);

  // Wait for 1 block confirmation
  const receipt = await tx.wait(1);

  return {
    hash: receipt.hash,
    blockNumber: receipt.blockNumber,
    from: receipt.from,
    gasUsed: receipt.gasUsed ? receipt.gasUsed.toString() : '0',
  };
};

export const hasVotedOnChain = async (
  electionNumericId: number,
  voterAddress: string
): Promise<boolean> => {
  try {
    const contract = await getContractInstance(false);
    const voted = await contract.hasVoted(electionNumericId, voterAddress);
    return voted;
  } catch (error) {
    console.error('Error checking on-chain voted status:', error);
    return false;
  }
};

export const getWinnerOnChain = async (electionNumericId: number) => {
  try {
    const contract = await getContractInstance(false);
    const winner = await contract.getWinner(electionNumericId);
    return {
      id: winner.id.toString(),
      name: winner.name,
      party: winner.party,
      voteCount: winner.voteCount.toString(),
    };
  } catch (error) {
    console.error('Error fetching on-chain winner:', error);
    return null;
  }
};
