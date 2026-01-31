# MetaMask Wallet Integration

This project implements MetaMask wallet integration for a React property rental application.

## Features

- **Wallet Connection**: Connect to MetaMask wallet with one click
- **Account Management**: Handle account switching automatically 
- **Network Detection**: Display current network and handle network changes
- **Persistent Connection**: Remembers wallet connection state across sessions
- **Error Handling**: User-friendly error messages for common issues

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Make sure MetaMask is installed in your browser
2. Click the "Connect Wallet" button in the navigation
3. Approve the connection in MetaMask
4. Your wallet address and network will be displayed

## Supported Networks

- Ethereum Mainnet
- Sepolia Testnet  
- Goerli Testnet
- Polygon Mainnet
- Polygon Mumbai
- Arbitrum
- Optimism

## Tech Stack

- React 18
- Ethers.js v6
- React Bootstrap
- Font Awesome icons

## File Structure

```
src/
├── components/wallet/
│   ├── WalletButton.js    # Main wallet UI component
│   ├── WalletModal.js     # Connection modal
│   └── wallet.css         # Wallet-specific styles
├── context/
│   └── WalletContext.js   # Wallet state management
└── utils/
    └── ethereum.js        # Ethereum helper functions
```