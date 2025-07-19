import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaChartPie, FaShoppingBag, FaDownload, FaMoneyCheckAlt, FaSignOutAlt, FaHistory, FaCog } from 'react-icons/fa';
import { toast } from 'react-toastify';

const navItems = [
  { name: 'Overview', path: '/admin/overview', icon: <FaChartPie /> },
  { name: 'Manage Product', path: '/admin/manage-product', icon: <FaCog />},
  { name: 'Add Product', path: '/admin/add-product', icon: <FaShoppingBag /> },
  { name: 'Booking Request', path: '/admin/booking-requests', icon: <FaDownload /> },
  { name: 'Transactions', path: '/admin/transactions', icon: <FaMoneyCheckAlt /> },
];

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/admin');
  };
  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col">
      <div className="flex items-center gap-2 px-6 py-5 border-b">
        <img src={require('../../assets/logo.png')} alt="Logo" className="w-10 h-10 rounded" />
        <span className="font-bold text-lg">ProRentals</span>
      </div>
      <nav className="flex-1 px-2 py-4 flex flex-col gap-3">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-xl transition font-medium text-base mb-1
              ${isActive ? 'bg-purple-50 text-purple-600 font-semibold' : 'text-black hover:bg-gray-100'}
              `
            }
          >
            <span className={`text-xl`}>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-xl transition font-medium text-base text-black hover:bg-gray-100 w-full mt-2"
        >
          <FaSignOutAlt className="text-xl" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
} 