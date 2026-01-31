import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BrowserProvider } from 'ethers';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

// Common network names mapping
const NETWORK_NAMES = {
  // Mainnets
  '0x1': 'Ethereum',
  '0xe708': 'Linea',
  '0x2105': 'Base',
  '0xa4b1': 'Arbitrum',
  '0x38': 'BNB Chain',
  '0xa': 'OP',
  '0x89': 'Polygon',
  '0x144': 'zkSync Era',
  '0x531': 'Sei',
  
  // Testnets
  '0xaa36a7': 'Sepolia',
  '0xe705': 'Linea Sepolia',
  '0x279f': 'Monad Testnet',
  '0x18c1': 'MegaETH Testnet',
};

const getNetworkName = (chainId) => {
  if (!chainId) return 'Unknown';
  return NETWORK_NAMES[chainId.toLowerCase()] || `Chain ${parseInt(chainId, 16)}`;
};

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Get MetaMask provider
  const getMetaMaskProvider = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const { ethereum } = window;
    if (!ethereum) return null;
    if (Array.isArray(ethereum.providers)) {
      return ethereum.providers.find((p) => p.isMetaMask) || null;
    }
    return ethereum.isMetaMask ? ethereum : null;
  }, []);

  const isMetaMaskInstalled = useCallback(() => !!getMetaMaskProvider(), [getMetaMaskProvider]);

  // Update provider instance
  const updateProvider = useCallback(() => {
    const ethProvider = getMetaMaskProvider();
    if (ethProvider) {
      setProvider(new BrowserProvider(ethProvider));
    }
  }, [getMetaMaskProvider]);

  // Handle account changes from MetaMask
  const handleAccountsChanged = useCallback((accounts) => {
    if (accounts.length === 0) {
      // User disconnected
      setAccount(null);
      setProvider(null);
      setChainId(null);
      localStorage.removeItem('walletConnected');
    } else {
      setAccount(accounts[0]);
      localStorage.setItem('walletConnected', 'true');
      updateProvider();
    }
  }, [updateProvider]);

  // Handle chain/network changes from MetaMask
  const handleChainChanged = useCallback((newChainId) => {
    console.log('Network changed to:', newChainId, getNetworkName(newChainId));
    setChainId(newChainId);
    updateProvider();
  }, [updateProvider]);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    const ethProvider = getMetaMaskProvider();
    
    if (!ethProvider) {
      setError('MetaMask not detected. Please install MetaMask.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request accounts
      const accounts = await ethProvider.request({ method: 'eth_requestAccounts' });
      
      // Get current chain
      const currentChainId = await ethProvider.request({ method: 'eth_chainId' });
      
      setAccount(accounts[0]);
      setChainId(currentChainId);
      setProvider(new BrowserProvider(ethProvider));
      localStorage.setItem('walletConnected', 'true');
    } catch (err) {
      if (err.code === 4001) {
        setError('Connection rejected by user');
      } else {
        setError('Failed to connect wallet');
        console.error('Connect error:', err);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [getMetaMaskProvider]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setChainId(null);
    setError(null);
    localStorage.removeItem('walletConnected');
  }, []);

  // Switch network
  const switchNetwork = useCallback(async (targetChainId) => {
    const ethProvider = getMetaMaskProvider();
    if (!ethProvider) {
      setError('MetaMask not found');
      return false;
    }

    try {
      await ethProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainId }],
      });
      return true;
    } catch (err) {
      if (err.code === 4902) {
        setError('Network not added to MetaMask');
      } else if (err.code === 4001) {
        setError('Network switch rejected');
      } else {
        setError('Failed to switch network');
      }
      return false;
    }
  }, [getMetaMaskProvider]);

  // Setup event listeners for MetaMask
  useEffect(() => {
    const ethProvider = getMetaMaskProvider();
    if (!ethProvider) return;

    // Listen for account changes
    ethProvider.on('accountsChanged', handleAccountsChanged);
    
    // Listen for network/chain changes
    ethProvider.on('chainChanged', handleChainChanged);

    return () => {
      ethProvider.removeListener('accountsChanged', handleAccountsChanged);
      ethProvider.removeListener('chainChanged', handleChainChanged);
    };
  }, [getMetaMaskProvider, handleAccountsChanged, handleChainChanged]);

  // Auto-reconnect on page load if previously connected
  useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected');
    if (wasConnected && isMetaMaskInstalled()) {
      connectWallet();
    }
  }, [connectWallet, isMetaMaskInstalled]);

  // Derive network info from chainId
  const network = chainId ? {
    chainId,
    name: getNetworkName(chainId),
    chainIdNumber: parseInt(chainId, 16),
  } : null;

  const value = {
    // State
    account,
    provider,
    chainId,
    network,
    isConnecting,
    error,
    isConnected: !!account,
    isMetaMaskInstalled: isMetaMaskInstalled(),
    
    // Actions
    connectWallet,
    disconnectWallet,
    switchNetwork,
    clearError: () => setError(null),
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
