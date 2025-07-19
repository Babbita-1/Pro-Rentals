import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaUser, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../contexts/AuthContext";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();


  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await loginUser(formData.email, formData.password);
      if (result.success) {
        const userData = JSON.parse(localStorage.getItem('user'));
        const userName = userData?.name || userData?.email || 'User';
        toast.success(`Welcome back, ${userName}! You have successfully logged in.`);
        // Add a small delay to ensure toast is visible before navigation
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error(result.message || "Login failed.");
      }
    } catch (error) {
      toast.error("Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <img src={logo} alt="ProRentals Logo" className="h-32 mb-6" />
      <h2 className="text-3xl font-extrabold text-center mb-8 tracking-wide">LOG IN</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-6">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400">
            <FaUser />
          </span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Username"
            required
            className="pl-12 pr-4 py-4 w-full rounded-2xl bg-purple-50 text-gray-800 text-base outline-none focus:ring-2 focus:ring-purple-300 shadow-sm"
          />
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400">
            <FaLock />
          </span>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="pl-12 pr-4 py-4 w-full rounded-2xl bg-purple-50 text-gray-800 text-base outline-none focus:ring-2 focus:ring-purple-300 shadow-sm"
          />
        </div>
        <div className="flex justify-end -mt-4">
          <Link to="/forgot-password" className="text-blue-500 hover:underline text-base font-medium">Forgot password?</Link>
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-2xl font-bold text-lg text-white shadow-lg transition"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login Now"}
        </button>
      </form>
      <div className="mt-4 text-center text-base">
        Don't an account? Please{' '}
        <Link to="/register" className="text-blue-600 hover:underline font-medium">Register</Link>
      </div>
    </div>
  );
};

export default LoginForm;
