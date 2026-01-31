import React from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { useWallet } from '../../context/WalletContext';
import './wallet.css';

function WalletModal({ show, onHide }) {
  const { error, isMetaMaskInstalled, connectWallet } = useWallet();

  const handleInstallMetaMask = () => {
    window.open('https://metamask.io/download/', '_blank');
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isMetaMaskInstalled ? 'Connect Wallet' : 'MetaMask Not Found'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isMetaMaskInstalled ? (
          <div className="text-center py-3">
            <i className="fa-solid fa-wallet fa-3x text-warning mb-3"></i>
            <h5>MetaMask Required</h5>
            <p className="text-muted">
              You'll need MetaMask to connect your wallet.
            </p>
            <Button 
              variant="primary" 
              onClick={handleInstallMetaMask}
              className="mt-3"
            >
              <i className="fa-solid fa-download me-2"></i>
              Install MetaMask
            </Button>
          </div>
        ) : (
          <div className="text-center py-3">
            <i className="fa-brands fa-ethereum fa-3x text-primary mb-3"></i>
            <h5>Connect Wallet</h5>
            <p className="text-muted">
              Connect your Ethereum wallet to get started.
            </p>
            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}
            <Button 
              variant="primary" 
              onClick={async () => {
                await connectWallet();
                onHide();
              }}
              className="mt-3"
            >
              <i className="fa-solid fa-link me-2"></i>
              Connect Wallet
            </Button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default WalletModal;
