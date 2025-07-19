import React from 'react';
import AdminSidebar from '../components/common/AdminSidebar';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

export default function AdminAddProduct() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500 mb-2">Not authorized</div>
            <div className="text-gray-500">You do not have permission to view this page.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-lg bg-white rounded-xl shadow p-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-8">Add New Product</h2>
          <div className="flex flex-col gap-6 w-full">
            <button
              className="w-full py-6 rounded-xl bg-purple-600 text-white text-xl font-semibold shadow hover:bg-purple-700 transition"
              onClick={() => navigate('/admin/add-vehicle')}
            >
              Add Vehicle
            </button>
            <button
              className="w-full py-6 rounded-xl bg-blue-600 text-white text-xl font-semibold shadow hover:bg-blue-700 transition"
              onClick={() => navigate('/admin/add-item')}
            >
              Add Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 