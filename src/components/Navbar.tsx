import React, { useState } from "react";
import { FiSearch, FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { BsCart3 } from "react-icons/bs";
import ThemeToggle from "./Mode";
import flag from "../assets/9ja.png";
import { useCart } from "../context/CardContext";
import CartModal from "./CartModal";
import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";


const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [showLogin, setShowLogin] = useState(false);


  const { cartCount } = useCart();
  const isAdmin = Boolean(typeof window !== 'undefined' && localStorage.getItem('admin_token'));

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim() !== "") console.log("Searching:", search);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-milk dark:bg-darkblack text-slate-900 dark:text-white shadow-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-4 py-3 gap-3 md:px-6">

          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <h1 className="text-2xl md:text-3xl font-bold whitespace-nowrap">
              <span className="text-primary">M</span>ercient
            </h1>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-white dark:bg-gray-800 rounded-full px-3 md:px-4 py-2 shadow-inner flex-grow sm:flex-grow-0 sm:w-[65%] md:w-[50%] min-w-[220px] order-3 sm:order-none"
          >
            <input
              type="text"
              placeholder="Search for products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm md:text-base"
            />
            <button
              type="submit"
              className="ml-2 bg-primary text-white rounded-full px-3 py-1.5 hover:bg-secondary transition-colors flex items-center gap-1"
            >
              <FiSearch size={16} />
              <span className="hidden sm:inline text-sm">Search</span>
            </button>
          </form>

          {/* Right side */}
          <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
            {/* Flag + Currency */}
            <div className="flex items-center gap-1 font-medium text-slate-900 dark:text-gray-300">
              <img src={flag} alt="NG flag" className="w-5 h-5 rounded-full" />
              <span className="hidden sm:inline">NGN</span>
            </div>

            {/* Cart Icon */}
            <button
              onClick={() => setShowCart(true)}
              className="relative text-2xl hover:text-primary transition-all"
            >
              <BsCart3 />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full px-[5px]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* ✅ Sign Up Button (Restored) */}
            <button
              onClick={() => setShowSignup(true)}
              className="hidden md:inline-block bg-primary text-white text-sm px-4 py-2 rounded-full hover:bg-secondary transition-colors"
            >
              Sign Up
            </button>

            {/* Admin controls (only visible if admin token present) */}
            {isAdmin ? (
              <div className="hidden md:flex items-center gap-2">
                <a href="/admin" className="text-sm px-2 py-1 hover:underline">Admin</a>
                <button onClick={handleAdminLogout} className="text-sm px-2 py-1 text-red-600">Logout</button>
              </div>
            ) : (
              <a href="/admin/login" className="hidden md:inline text-sm px-2 py-1 hover:underline">Admin Login</a>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-2xl hover:text-primary transition-all"
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-5 py-3 space-y-3">
            <div>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-between w-full font-medium text-slate-900 dark:text-gray-300 py-2"
              >
                Products
                <FiChevronDown
                  className={`transform transition-transform duration-300 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {dropdownOpen && (
                <div className="pl-4 space-y-2 text-gray-700 dark:text-gray-300">
                  <a href="#" className="block hover:text-primary">Men’s Fashion</a>
                  <a href="#" className="block hover:text-primary">Women’s Fashion</a>
                  <a href="#" className="block hover:text-primary">Electronics</a>
                  <a href="#" className="block hover:text-primary">Home & Kitchen</a>
                </div>
              )}
            </div>

            <a href="#" className="block hover:text-primary">Deals</a>
            <a href="#" className="block hover:text-primary">Contact Us</a>

            {/* ✅ Mobile Sign Up */}
            <button 
                      onClick={() => setShowSignup(true)}
className="w-full bg-primary text-white text-sm px-4 py-2 rounded-full hover:bg-secondary transition-colors">
              Sign Up
            </button>
          </div>
        )}
      </nav>
            <SignupModal
              isOpen={showSignup}
              onClose={() => setShowSignup(false)}
              openLogin={() => {
                setShowSignup(false);
                setShowLogin(true);
              }}
            />
            <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />


      {/* ✅ Cart Popup */}
      {showCart && (
        <CartModal
          onClose={() => setShowCart(false)}
          onCheckout={() => {
            setShowCart(false);
            window.location.href = "/checkout";
          }}
        />
      )}
    </>
  );
};

export default Navbar;

