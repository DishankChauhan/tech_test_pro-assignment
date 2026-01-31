import React, { useState } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { useWallet } from '../../context/WalletContext';
import WalletModal from './WalletModal';
import './wallet.css';

function WalletButton() {
  const { 
    account, 
    network, 
    isConnecting, 
    isConnected, 
    connectWallet, 
    disconnectWallet,
    refreshNetwork
  } = useWallet();
  
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const truncateAddr = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const copyAddr = () => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    try {
      await connectWallet();
    } catch (error) {
      // connection failed
    }
  };

  if (!isConnected) {
    return (
      <>
        <Button
          type="button"
          variant="primary"
          className="btn-primary d-none d-lg-inline-block wallet-connect-btn"
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Connecting...
            </>
          ) : (
            "Connect Wallet"
          )}
        </Button>
        <WalletModal show={showModal} onHide={() => setShowModal(false)} />
      </>
    );
  }

  return (
    <Dropdown className="wallet-dropdown d-none d-lg-inline-block">
      <Dropdown.Toggle variant="success" id="wallet-dropdown" className="wallet-connected-btn">
        <span className="status-indicator"></span>
        {truncateAddr(account)}
      </Dropdown.Toggle>

      <Dropdown.Menu align="end" className="wallet-menu">
        <div className="wallet-info">
          <div className="wallet-address-full">
            <small className="text-muted">Wallet Address</small>
            <div className="d-flex align-items-center justify-content-between mt-1">
              <span className="address-text">{truncateAddr(account)}</span>
              <Button 
                variant="link" 
                size="sm" 
                className="copy-btn p-0"
                onClick={copyAddr}
                title="Copy address"
              >
                {copied ? (
                  <i className="fa-solid fa-check text-success"></i>
                ) : (
                  <i className="fa-regular fa-copy"></i>
                )}
              </Button>
            </div>
          </div>
          
          {network && (
            <div className="network-info mt-2">
              <small className="text-muted">Network</small>
              <div className="network-badge mt-1">
                <span className="network-dot"></span>
                {network.name}
              </div>
            </div>
          )}
        </div>
        
        <Dropdown.Divider />
        
        <Dropdown.Item 
          onClick={copyAddr}
          className="dropdown-action"
        >
          <i className="fa-regular fa-copy me-2"></i>
          {copied ? 'Copied!' : 'Copy Address'}
        </Dropdown.Item>
        
        <Dropdown.Item 
          href={`https://etherscan.io/address/${account}`}
          target="_blank"
          rel="noopener noreferrer"
          className="dropdown-action"
        >
          <i className="fa-solid fa-arrow-up-right-from-square me-2"></i>
          View on Explorer
        </Dropdown.Item>
        
        <Dropdown.Item 
          onClick={refreshNetwork}
          className="dropdown-action"
        >
          <i className="fa-solid fa-refresh me-2"></i>
          Refresh Network
        </Dropdown.Item>
        
        <Dropdown.Divider />
        
        <Dropdown.Item 
          onClick={disconnectWallet}
          className="dropdown-action text-danger"
        >
          <i className="fa-solid fa-arrow-right-from-bracket me-2"></i>
          Disconnect
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default WalletButton;
