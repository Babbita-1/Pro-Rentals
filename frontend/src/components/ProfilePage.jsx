import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/user";
import LoadingSpinner from "./common/LoadingSpinner";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phoneNumber: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getProfile()
      .then(res => {
        setProfile(res.data);
        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          phoneNumber: res.data.phoneNumber || ""
        });
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="max-w-xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-lg flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-400 to-blue-400 flex items-center justify-center text-white text-4xl font-bold shadow-md mb-2">
          {form.name ? form.name[0].toUpperCase() : <span className="text-3xl">👤</span>}
        </div>
        <h2 className="text-3xl font-extrabold text-gray-800">{form.name || "My Profile"}</h2>
        <p className="text-gray-500">{form.email}</p>
      </div>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-purple-400 outline-none transition" required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-purple-400 outline-none transition" required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
          <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Phone" className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-purple-400 outline-none transition" />
        </div>
        <button type="submit" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-bold mt-2 shadow hover:from-purple-600 hover:to-blue-600 transition disabled:opacity-60" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
      <button
        onClick={async () => { 
          await logout(); 
          navigate('/login'); 
        }}
        className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg font-bold mt-6 shadow"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;
