import { BrowserRouter } from "react-router-dom";
import AboutUs from "./pages/AboutUs";
import NavBar from "./components/navbar/Navbar";
import Developers from "./pages/Developers";
import Footer from "./pages/Footer";
import Join from "./pages/Join";
import Loading from "./pages/Header";
import Partners from "./pages/Partners";
import Properties from "./pages/Properties";
import Subscribe from "./pages/Subscribe";
import { WalletProvider } from "./context/WalletContext";

function App() {
  return (
    <>
      <WalletProvider>
        <BrowserRouter>
          <NavBar />
          <Loading />
          <Partners />
          <Properties />
          <AboutUs />
          <Developers />
          <Join />
          <Subscribe />
          <Footer />
        </BrowserRouter>
      </WalletProvider>
    </>
  );
}

export default App;
