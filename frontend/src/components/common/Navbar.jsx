import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import logo from "../../assets/logo.png";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [serviceOpen, setServiceOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Helper to check if link is active
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md py-2 px-4 w-full z-50 sticky top-0">
      <div className="container mx-auto flex items-center justify-between relative">
        {/* Logo */}
        <Link to="/">
          <div className="flex items-center space-x-2 ml-4 md:ml-20">
            <img src={logo} alt="ProRentals Logo" className="h-12 w-auto md:h-16" />
          </div>
        </Link>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden text-2xl p-2 focus:outline-none"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label="Open menu"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        {/* Centered Nav Links - Desktop */}
        <div className="flex-1 hidden md:flex justify-center">
          <ul className="flex space-x-8 items-center font-semibold text-black">
            <li>
              <Link to="/" className={isActive("/") ? "font-bold underline" : "hover:text-blue-700 hover:underline transition-colors duration-200"}>Home</Link>
            </li>
            <li className="relative">
              <button
                className="flex items-center focus:outline-none hover:text-blue-700 hover:underline transition-colors duration-200"
                onClick={() => setServiceOpen((open) => !open)}
                onBlur={() => setTimeout(() => setServiceOpen(false), 150)}
              >
                Service
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {serviceOpen && (
                <ul className="absolute left-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                  <li><Link to="/vehicles" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200">All Vehicles</Link></li>
                  <li><Link to="/items" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200">My Items</Link></li>
                  <li><Link to="/my-bookings" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200">My Bookings</Link></li>
                </ul>
              )}
            </li>
            <li>
              <Link to="/about" className={isActive("/about") ? "font-bold underline" : "hover:text-blue-700 hover:underline transition-colors duration-200"}>About Us</Link>
            </li>
            <li>
              <Link to="/contact" className={isActive("/contact") ? "font-bold underline" : "hover:text-blue-700 hover:underline transition-colors duration-200"}>Contact Us</Link>
            </li>
          </ul>
        </div>
        {/* Right Side Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-5 mr-4 md:mr-20">
          {!user ? (
            <>
              <Link to="/login" className="flex items-center font-semibold hover:text-blue-700 hover:underline transition-colors duration-200">
                Log in
              </Link>
              <Link to="/cart" className="flex items-center text-xl hover:text-blue-700 transition-colors duration-200 relative">
                <FaShoppingCart />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                    {cart.length}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="font-semibold hover:text-blue-700 hover:underline transition-colors duration-200">Profile</Link>
              <Link to="/cart" className="flex items-center text-xl hover:text-blue-700 transition-colors duration-200 relative">
                <FaShoppingCart />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                    {cart.length}
                  </span>
                )}
              </Link>
            </>
          )}
        </div>
        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
        )}
        {/* Mobile Menu Drawer */}
        <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 md:hidden`}>
          <div className="flex flex-col h-full p-6">
            <div className="flex items-center justify-between mb-8">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <img src={logo} alt="ProRentals Logo" className="h-10 w-auto" />
              </Link>
              <button className="text-2xl p-2" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <FaTimes />
              </button>
            </div>
            <ul className="flex flex-col space-y-6 font-semibold text-black">
              <li>
                <Link to="/" className={isActive("/") ? "font-bold underline" : "hover:text-blue-700 hover:underline transition-colors duration-200"} onClick={() => setMobileMenuOpen(false)}>Home</Link>
              </li>
              <li className="relative">
                <button
                  className="flex items-center focus:outline-none hover:text-blue-700 hover:underline transition-colors duration-200"
                  onClick={() => setServiceOpen((open) => !open)}
                >
                  Service
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {serviceOpen && (
                  <ul className="mt-2 ml-4 bg-white border rounded shadow-lg z-50">
                    <li><Link to="/vehicles" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>All Vehicles</Link></li>
                    <li><Link to="/items" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>My Items</Link></li>
                    <li><Link to="/my-bookings" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>My Bookings</Link></li>
                  </ul>
                )}
              </li>
              <li>
                <Link to="/about" className={isActive("/about") ? "font-bold underline" : "hover:text-blue-700 hover:underline transition-colors duration-200"} onClick={() => setMobileMenuOpen(false)}>About Us</Link>
              </li>
              <li>
                <Link to="/contact" className={isActive("/contact") ? "font-bold underline" : "hover:text-blue-700 hover:underline transition-colors duration-200"} onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>
              </li>
            </ul>
            <div className="mt-auto flex flex-col space-y-4 pt-8 border-t">
              {!user ? (
                <>
                  <Link to="/login" className="font-semibold hover:text-blue-700 hover:underline transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                    Log in
                  </Link>
                  <Link to="/cart" className="flex items-center text-xl hover:text-blue-700 transition-colors duration-200 relative" onClick={() => setMobileMenuOpen(false)}>
                    <FaShoppingCart />
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/profile" className="font-semibold hover:text-blue-700 hover:underline transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                  <Link to="/cart" className="flex items-center text-xl hover:text-blue-700 transition-colors duration-200 relative" onClick={() => setMobileMenuOpen(false)}>
                    <FaShoppingCart />
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
