import React from "react";
import { Route, BrowserRouter, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CardContext";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./admin/AdminDashboard";
import LoginModal from "./components/LoginModal";
import { UserProvider } from "./context/UserContext";

const App: React.FC = () => {
  return (
    <UserProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<AdminDashboard />} />
            {/* Route-based modal: wrap LoginModal so it receives isOpen and onClose */}
            <Route path="/login" element={<LoginModalRoute />} />


          </Routes>
        </BrowserRouter>
      </CartProvider>
    </UserProvider>
  );
};

export default App;

const LoginModalRoute: React.FC = () => {
  const navigate = useNavigate();
  return <LoginModal isOpen={true} onClose={() => navigate(-1)} />;
};
