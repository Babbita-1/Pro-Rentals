import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/common/AdminSidebar';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { createItem } from '../services/items';
import { toast } from 'react-toastify';
import axios from 'axios'; // Added axios import

const initialForm = {
  brand: '',
  model: '',
  year: '',
  pricePerHour: '',
  description: '',
  imageUrl: '',
  status: '',
};

export default function AdminAddItem() {
  const { user, loading: authLoading } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  // Removed selectedPublicImage state

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    const fileInput = document.getElementById('item-image-upload');
    if (fileInput) fileInput.value = '';
  };

  const validate = () => {
    if (!form.brand || !form.model || !form.year || !form.pricePerHour || !form.description || !selectedFile || !form.status) return 'All fields are required, including an image.';
    if (isNaN(form.year) || Number(form.year) < 1900) return 'Year must be a valid number.';
    if (isNaN(form.pricePerHour) || Number(form.pricePerHour) <= 0) return 'Price per hour must be a positive number.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    const validation = validate();
    if (validation) {
      setError(validation);
      toast.error(validation);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: form.pricePerHour,
        imageUrl: selectedFile ? `/item-images/${selectedFile.name}` : '', // Use selectedFile name
      };
      // Log payload for debugging
      console.log('Submitting payload:', payload);
      await axios.post('/api/items', payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      setSuccess('Item added successfully!');
      toast.success('Item added successfully!');
      setForm(initialForm);
      // Removed setSelectedPublicImage(null);
      setImagePreview(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item.');
      toast.error(err.response?.data?.message || 'Failed to add item.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-lg bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold mb-6">Add New Item</h2>
          {success && <div className="mb-4 text-green-600">{success}</div>}
          {error && <div className="mb-4 text-red-500">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Brand</label>
              <input type="text" name="brand" value={form.brand} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Model</label>
              <input type="text" name="model" value={form.model} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Year</label>
              <input type="number" name="year" value={form.year} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Price Per Hour</label>
              <input type="number" name="pricePerHour" value={form.pricePerHour} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Status</label>
              <input type="text" name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={2} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Item Image</label>
              <div className="flex items-center space-x-4 mb-2">
                <label htmlFor="item-image-upload" className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer font-semibold hover:bg-purple-700 transition">
                  Choose file
                </label>
                <input
                  id="item-image-upload"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="mb-1 font-medium">{selectedFile ? selectedFile.name : 'No image chosen'}</span>
              </div>
              {imagePreview && (
                <div className="mt-2 flex justify-center">
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Preview" className="w-64 max-w-full rounded shadow" />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-red-600 hover:bg-red-100 hover:text-red-800 transition focus:outline-none"
                      style={{ lineHeight: 1 }}
                      aria-label="Remove image"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Item'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 