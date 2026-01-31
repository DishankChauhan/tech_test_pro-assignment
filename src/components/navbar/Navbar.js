import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "../../images/logo/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navbar.css";
import WalletButton from "../wallet/WalletButton";
import { useWallet } from "../../context/WalletContext";
import { Alert } from "react-bootstrap";

function NavBar() {
  const { isMetaMaskInstalled } = useWallet();

  return (
    <>
      {!isMetaMaskInstalled && (
        <Alert variant="warning" className="mb-0 text-center py-2 rounded-0">
          <i className="fa-solid fa-triangle-exclamation me-2"></i>
          MetaMask is not installed. 
          <a 
            href="https://metamask.io/download/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="alert-link ms-1"
          >
            Install it here
          </a>
        </Alert>
      )}
      <Navbar expand="lg" className="py-3">
        <Container>
          <Navbar.Brand href="#home" className="me-lg-5" onClick={(e) => e.preventDefault()}>
            <img className="logo" src={logo} alt="logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" navbarScroll>
              <Nav.Link href="#action1">Marketplace</Nav.Link>
              <Nav.Link href="#action2" className="px-lg-3">
                About Us
              </Nav.Link>
              <Nav.Link href="#action3">Developers</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <div className="d-flex align-items-center order">
            <span className="line d-lg-inline-block d-none"></span>
            <i className="fa-regular fa-heart"></i>
            <WalletButton />
          </div>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;
