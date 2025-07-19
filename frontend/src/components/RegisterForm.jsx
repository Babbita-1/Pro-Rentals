import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { register as registerService } from "../services/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await registerService({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber
      });
      if (res.data.token && res.data.user) {
        login(res.data.token, res.data.user);
        toast.success("Registration successful! You are now logged in.");
        navigate("/");
      } else {
        toast.success("Registration successful! Redirecting to login...");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-8">
        <h2 className="text-4xl font-extrabold text-center mb-2">Sign up</h2>
        <div>
          <label className="block text-lg font-medium mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 px-4 py-3 text-lg outline-none bg-white"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Email</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 px-4 py-3 text-lg outline-none bg-white"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 px-4 py-3 text-lg outline-none bg-white"
            required
          />
        </div>
        <div className="relative">
          <label className="block text-lg font-medium mb-2">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 px-4 py-3 text-lg outline-none bg-white pr-12"
            required
          />
          <span
            className="absolute right-4 top-16 transform -translate-y-1/2 text-xl text-gray-400 cursor-pointer"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div className="relative">
          <label className="block text-lg font-medium mb-2">Confirm Password</label>
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 px-4 py-3 text-lg outline-none bg-white pr-12"
            required
          />
          <span
            className="absolute right-4 top-16 transform -translate-y-1/2 text-xl text-gray-400 cursor-pointer"
            onClick={() => setShowConfirm((v) => !v)}
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <button
          type="submit"
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign up"}
        </button>
        <div className="text-center text-lg mt-2">
          Already have an account ?{' '}
          <Link to="/login" className="text-purple-600 hover:underline font-medium">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
