import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginAdmin, user, logout, loading } = useAuth();

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin/overview');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    try {
      const result = await loginAdmin(form.email, form.password);
      if (result.success) {
        toast.success('Welcome back, Admin! You have successfully logged in.');
      } else {
        setError(result.message || 'Login failed.');
      }
    } catch (err) {
      setError('Login failed.');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (user && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
        <img src={logo} alt="ProRentals Logo" className="h-36 mb-6" />
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10 tracking-wide">ADMIN LOGIN</h2>
        <div className="w-full max-w-md flex flex-col gap-6 items-center bg-white p-8 rounded-2xl shadow">
          <p className="text-lg text-gray-700 text-center mb-4">You are currently logged in as a user. Please log out before logging in as admin.</p>
          <button
            type="button"
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-2xl font-bold text-lg text-white shadow transition mt-2"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <img src={logo} alt="ProRentals Logo" className="h-36 mb-6" />
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10 tracking-wide">ADMIN LOGIN</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-6">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">
            <FaUser />
          </span>
          <input
            type="text"
            name="email"
            value={form.email || ''}
            onChange={handleChange}
            placeholder="Email"
            required
            className="pl-12 pr-4 py-4 w-full rounded-2xl bg-purple-50 text-gray-800 text-base outline-none focus:ring-2 focus:ring-purple-300 shadow-sm"
          />
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">
            <FaLock />
          </span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="pl-12 pr-4 py-4 w-full rounded-2xl bg-purple-50 text-gray-800 text-base outline-none focus:ring-2 focus:ring-purple-300 shadow-sm"
          />
        </div>
        <div className="flex justify-end -mt-2">
          <Link to="/admin-forget-pass" className="text-blue-500 hover:underline text-base font-medium">Forgot password?</Link>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-2xl font-bold text-lg text-white shadow-lg transition mt-2"
          disabled={formLoading}
        >
          {formLoading ? "Logging in..." : "Login Now"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full hover:bg-gray-300 py-3 rounded-2xl font-semibold text-lg text-gray-700 shadow transition mt-2"
        >
          Return to ProRentals
        </button>
      </form>
    </div>
  );
};

export default AdminLogin; 