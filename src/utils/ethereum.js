// Ethereum helper functions

export const truncateAddress = (address, chars = 4) => {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};

export const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const getNetworkDetails = (chainId) => {
  const networks = {
    '0x1': {
      name: 'Ethereum Mainnet',
      symbol: 'ETH',
      explorer: 'https://etherscan.io',
      color: '#627EEA'
    },
    '0xaa36a7': {
      name: 'Sepolia Testnet',
      symbol: 'SepoliaETH',
      explorer: 'https://sepolia.etherscan.io',
      color: '#8B7FBA'
    },
    '0x5': {
      name: 'Goerli Testnet',
      symbol: 'GoerliETH',
      explorer: 'https://goerli.etherscan.io',
      color: '#3099f2'
    },
    '0x89': {
      name: 'Polygon Mainnet',
      symbol: 'MATIC',
      explorer: 'https://polygonscan.com',
      color: '#8247E5'
    },
    '0x13881': {
      name: 'Polygon Mumbai',
      symbol: 'MATIC',
      explorer: 'https://mumbai.polygonscan.com',
      color: '#8247E5'
    },
    '0xa4b1': {
      name: 'Arbitrum One',
      symbol: 'ETH',
      explorer: 'https://arbiscan.io',
      color: '#28A0F0'
    },
    '0xa': {
      name: 'Optimism',
      symbol: 'ETH',
      explorer: 'https://optimistic.etherscan.io',
      color: '#FF0420'
    },
  };

  return networks[chainId] || {
    name: `Unknown (${chainId})`,
    symbol: 'ETH',
    explorer: '',
    color: '#666'
  };
};

export const formatBalance = (balance, decimals = 4) => {
  if (!balance) return '0';
  return parseFloat(balance).toFixed(decimals);
};

export const isMetaMaskInstalled = () => {
  return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
};

export const getMetaMaskInstallUrl = () => {
  const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
  return isFirefox 
    ? 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/'
    : 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn';
};

export const switchNetwork = async (chainId) => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
  } catch (error) {
    if (error.code === 4902) {
      throw new Error('Network not added to MetaMask');
    }
    throw error;
  }
};

export const addNetwork = async (networkConfig) => {
  await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [networkConfig],
  });
};
