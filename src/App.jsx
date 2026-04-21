import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage.jsx";
import useLenis from "./hooks/useLenis.js"
import { useEffect } from "react";
import axios from "axios";
import { USER_ENDPOINTS } from "./pages/endpoints";
import Product from "./Pages/Product.jsx";
import WishListUI from "./Pages/WishListUI.jsx";
import OfferSection from "./Pages/Offer.jsx";
import SingleProductDisplay from "./Pages/SingleProductDisplay.jsx";
import Login from "./Pages/Login.jsx";

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
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Product_Page" element={<Product />}></Route>
        <Route path="/Product_Page/SingleProductDisplay" element={<SingleProductDisplay />}></Route>

        {/* All wishlist routes */}
        <Route path="/Wish_List" element={<WishListUI />}></Route>
        <Route path="/Product_Page/Wish_List" element={<WishListUI />}></Route>
        <Route path="/Product_Page/SingleProductDisplay/Wish_List" element={<WishListUI />}></Route>

        {/* All offer routes */}
        <Route path="/Offer" element={<OfferSection />}></Route>
        <Route path="/Product_Page/Offer" element={<OfferSection />}></Route>
        <Route path="/Product_Page/SingleProductDisplay/Offer" element={<OfferSection />}></Route>

      </Routes>
    </div>
  );
}

export default App;