import React from "react";
import { Route, BrowserRouter, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CardContext";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLogin from "./admin/AdminLogin";
import RequireAdmin from "./admin/RequireAdmin";
import LoginModal from "./components/LoginModal";
import WhatsAppButton from "./components/WhatsAppButton";

const App: React.FC = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          {/* Route-based modal: wrap LoginModal so it receives isOpen and onClose */}
          <Route path="/login" element={<LoginModalRoute />} />


        </Routes>
        {/* Show WhatsApp floating chat on all pages */}
        <WhatsAppButton />
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;

const LoginModalRoute: React.FC = () => {
  const navigate = useNavigate();
  return <LoginModal isOpen={true} onClose={() => navigate(-1)} />;
};
