import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import useLenis from "./hooks/useLenis"
import { useEffect } from "react";
import axios from "axios";
import { USER_ENDPOINTS } from "./pages/endpoints";
import Product from "./pages/Product";
import WishListUI from "./pages/WishListUI";
import OfferSection from "./pages/Offer";
import SingleProductDisplay from "./pages/SingleProductDisplay";
import Login from "./pages/Login";
import ScrollToTop from "./pages/Utility";
import AIChatDrawer from "./pages/AIChatDrawer";

function App() {
  useLenis();
  useEffect(() => {
    async function setGuestId() {
      console.log
      try {
        await axios.get(`${USER_ENDPOINTS}/getGuestId`, { withCredentials: true });
      } catch (err) {
        console.error("Failed to set guest ID", err);
      }
    }

    setGuestId();
  }, []);

  return (
    <div className="h-auto w-screen bg-white font-serif">
        <ScrollToTop/>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Product_Page" element={<Product />}></Route>
        <Route path="/Product_Page/SingleProductDisplay" element={<SingleProductDisplay />}></Route>
        <Route path="/SingleProductDisplay" element={<SingleProductDisplay />}></Route>

        {/* All wishlist routes */}
        <Route path="/Wish_List" element={<WishListUI />}></Route>
        <Route path="/Product_Page/Wish_List" element={<WishListUI />}></Route>
        <Route path="/Product_Page/SingleProductDisplay/Wish_List" element={<WishListUI />}></Route>

        {/* All offer routes */}
        <Route path="/Offer" element={<OfferSection />}></Route>
        <Route path="/Product_Page/Offer" element={<OfferSection />}></Route>
        <Route path="/Product_Page/SingleProductDisplay/Offer" element={<OfferSection />}></Route>

      </Routes>
      <AIChatDrawer />
    </div>
  );
}

export default App;