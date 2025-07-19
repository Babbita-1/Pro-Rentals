import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => (
  <footer className="bg-[#18586B] text-white pt-12">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 items-start pb-8">
      {/* Logo & Location */}
      <div className="flex flex-col items-center md:items-start space-y-2 text-center md:text-left">
        <img src={logo} alt="ProRentals Logo" className="h-16 mb-2 mx-auto md:mx-0" />
        <div className="font-bold text-lg">Location & Contact</div>
        <div className="flex flex-col items-center md:items-start space-y-1">
          <div className="flex items-center justify-center md:justify-start"><FaMapMarkerAlt className="mr-2" /> Jamsikhel</div>
          <div className="text-sm">Lalitpur, Nepal</div>
        </div>
      </div>
      {/* Hotline */}
      <div className="flex flex-col items-center md:items-start space-y-2 text-center md:text-left">
        <div className="font-bold text-lg">Hotline</div>
        <div className="flex flex-col items-center md:items-start space-y-1">
          <div className="flex items-center justify-center md:justify-start"><FaPhoneAlt className="mr-2" /> <span className="break-all">015589281</span></div>
          <div className="flex items-center justify-center md:justify-start"><FaPhoneAlt className="mr-2" /> <span className="break-all">+977 9849876713</span></div>
          <a href="mailto:info@prorentals.com" className="flex items-center justify-center md:justify-start text-white hover:text-blue-200 transition">
            <FaEnvelope className="mr-2" /> <span className="break-all underline">info@prorentals.com</span>
          </a>
        </div>
      </div>
      {/* Social & Connect */}
      <div className="flex flex-col items-center md:items-start space-y-2">
        <div className="font-bold text-lg">Connect with Us</div>
        <div className="flex space-x-4 mb-2">
          <a href="https://www.facebook.com" className="text-white hover:text-blue-300 transition-colors duration-200"><FaFacebook size={28} /></a>
          <a href="https://www.instagram.com" className="text-white hover:text-blue-300 transition-colors duration-200"><FaInstagram size={28} /></a>
          <a href="https://www.linkedin.com" className="text-white hover:text-blue-300 transition-colors duration-200"><FaLinkedin size={28} /></a>
        </div>
        <div className="text-sm text-gray-200">Follow us on social media for updates!</div>
      </div>
      {/* Quick Navigation */}
      <div className="flex flex-col items-center md:items-start space-y-2">
        <div className="font-bold text-lg">Quick Navigation</div>
        <ul className="space-y-1">
          <li><Link to="/about" className="hover:text-blue-300 hover:underline transition-colors duration-200">About Us</Link></li>
          <li><Link to="/items" className="hover:text-blue-300 hover:underline transition-colors duration-200">Service</Link></li>
          <li><Link to="/sales" className="hover:text-blue-300 hover:underline transition-colors duration-200">Sales</Link></li>
          <li><Link to="/contact" className="hover:text-blue-300 hover:underline transition-colors duration-200">Contact Us</Link></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-blue-200/30 mt-6 pt-4 pb-2 bg-[#18586B]">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">
        <span>&copy; {new Date().getFullYear()} ProRentals. All rights reserved.</span>
      </div>
    </div>
  </footer>
);

export default Footer; 