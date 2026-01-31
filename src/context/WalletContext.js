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

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [network, setNetwork] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const getMetaMaskProvider = () => {
    if (typeof window === 'undefined') return null;
    const { ethereum } = window;
    if (!ethereum) return null;
    if (Array.isArray(ethereum.providers)) {
      return ethereum.providers.find((p) => p.isMetaMask) || null;
    }
    return ethereum.isMetaMask ? ethereum : null;
  };

  const isMetaMaskInstalled = () => !!getMetaMaskProvider();

  const getNetworkName = (chainId) => {
    const networks = {
      '0x1': 'Ethereum Mainnet',
      '0xaa36a7': 'Sepolia',
      '0x5': 'Goerli',
      '0x89': 'Polygon',
      '0x13881': 'Mumbai',
      '0xa4b1': 'Arbitrum',
      '0xa': 'Optimism',
    };
    return networks[chainId] || `Unknown (${chainId})`;
  };

  const connectWallet = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask not detected. Install MetaMask to continue.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const ethProvider = getMetaMaskProvider();
      if (!ethProvider) {
        setError('MetaMask not found');
        setIsConnecting(false);
        return;
      }

      const provider = new BrowserProvider(ethProvider);
      const accounts = await provider.send('eth_requestAccounts', []);
      const network = await provider.getNetwork();
      
      setProvider(provider);
      setAccount(accounts[0]);
      const chainId = '0x' + network.chainId.toString(16);
      setNetwork({
        chainId,
        name: getNetworkName(chainId)
      });

      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAccount', accounts[0]);
    } catch (err) {
      if (err.code === 4001) {
        setError('Connection cancelled');
      } else {
        setError('Connection failed');
      }
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null); 
    setNetwork(null);
    setError(null);
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAccount');  
  };

  const handleAccountsChanged = useCallback(async (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
      return;
    }

    setAccount(accounts[0]);
    localStorage.setItem('walletAccount', accounts[0]);

    try {
      const ethProvider = getMetaMaskProvider();
      if (!ethProvider) {
        disconnectWallet();
        return;
      }

      const provider = new BrowserProvider(ethProvider);
      setProvider(provider);

      const network = await provider.getNetwork();
      const chainId = '0x' + network.chainId.toString(16);
      setNetwork({
        chainId,
        name: getNetworkName(chainId)
      });
    } catch (err) {
      console.error('Account change error:', err);
    }
  }, []);

  const handleChainChanged = useCallback(async (chainId) => {
    setNetwork({ chainId, name: getNetworkName(chainId) });

    try {
      const ethProvider = getMetaMaskProvider();
      if (!ethProvider) {
        disconnectWallet();
        return;
      }

      const provider = new BrowserProvider(ethProvider);
      setProvider(provider);

      const accounts = await provider.send('eth_accounts', []);
      if (accounts?.[0]) {
        setAccount(accounts[0]);
        localStorage.setItem('walletAccount', accounts[0]);
      }
    } catch (err) {
      console.error('Network change error:', err);
    }
  }, []);

  useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected');
    if (wasConnected && isMetaMaskInstalled()) {
      connectWallet();
    }
  }, [connectWallet]);

  useEffect(() => {
    const ethProvider = getMetaMaskProvider();
    if (!ethProvider) return;

    ethProvider.on('accountsChanged', handleAccountsChanged);
    ethProvider.on('chainChanged', handleChainChanged);

    return () => {
      ethProvider.removeListener?.('accountsChanged', handleAccountsChanged);
      ethProvider.removeListener?.('chainChanged', handleChainChanged);
    };
  }, [handleAccountsChanged, handleChainChanged]);

  const value = {
    account,
    provider,
    network,
    isConnecting,
    error,
    isConnected: !!account,
    isMetaMaskInstalled: isMetaMaskInstalled(),
    connectWallet,
    disconnectWallet,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
