import React, { useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/auth";

const ForgetPage = () => {
  const [form, setForm] = useState({
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      await forgotPassword({
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
      });
      toast.success("Password reset successful! You can now log in.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to reset password. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md flex flex-col gap-6"
        style={{ fontFamily: 'Roboto, sans-serif' }}
      >
        <h2 className="text-3xl font-extrabold mb-2">Reset Password</h2>
        <div>
          <label className="block text-lg font-medium mb-2">Enter your Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-4 py-3 text-lg outline-none bg-gray-50"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Enter your Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            className="w-full rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-4 py-3 text-lg outline-none bg-gray-50"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Enter new Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-4 py-3 text-lg outline-none bg-gray-50"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Confirm new Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-4 py-3 text-lg outline-none bg-gray-50"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg py-4 rounded-2xl shadow-lg mt-2 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ForgetPage; 