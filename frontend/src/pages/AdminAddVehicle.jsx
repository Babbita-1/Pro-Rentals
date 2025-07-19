import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/common/AdminSidebar';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { addVehicle } from '../services/vehicles';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialForm = {
  type: 'car',
  brand: '',
  model: '',
  year: '',
  pricePerHour: '',
  available: true,
  description: '',
  imageUrl: '',
  seat: '',
  door: '',
  luggage: '',
  transmission: 'Automatic',
  drive: '',
  fuelType: '',
  engine: '',
  status: '',
};

export default function AdminAddVehicle() {
  const { user, loading: authLoading } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loadingImages, setLoadingImages] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch available vehicle images
  useEffect(() => {
    const fetchAvailableImages = async () => {
      try {
        const response = await axios.get('/api/vehicles/images/available');
        // setAvailableImages(response.data.images); // This line is no longer needed
      } catch (error) {
        console.error('Failed to fetch available images:', error);
      } finally {
        setLoadingImages(false);
      }
    };

    fetchAvailableImages();
  }, []);

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
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm((f) => ({ ...f, [name]: checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
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

  const validate = () => {
    if (!form.brand || !form.model || !form.year || !form.pricePerHour || !selectedFile) return 'All required fields must be filled, including an image.';
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
        imageUrl: selectedFile ? `/vehicle-images/${selectedFile.name}` : '',
      };
      // Log payload for debugging
      console.log('Submitting vehicle payload:', payload);
      await axios.post('/api/vehicles', payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      setSuccess('Vehicle added successfully!');
      toast.success('Vehicle added successfully!');
      setForm(initialForm);
      setSelectedFile(null);
      setImagePreview(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add vehicle.');
      toast.error(err.response?.data?.message || 'Failed to add vehicle.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold mb-6">Add New Vehicle</h2>
          {success && <div className="mb-4 text-green-600">{success}</div>}
          {error && <div className="mb-4 text-red-500">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Type</label>
                <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                  <option value="van">Van</option>
                  <option value="bus">Bus</option>
                  <option value="truck">Truck</option>
                  <option value="other">Other</option>
                </select>
              </div>
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
              <div className="flex items-center mt-6">
                <input type="checkbox" name="available" checked={form.available} onChange={handleChange} className="mr-2" />
                <label className="font-medium">Available</label>
              </div>
              <div>
                <label className="block mb-1 font-medium">Seat</label>
                <input type="number" name="seat" value={form.seat} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Door</label>
                <input type="number" name="door" value={form.door} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Luggage</label>
                <input type="text" name="luggage" value={form.luggage} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Transmission</label>
                <select name="transmission" value={form.transmission} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Drive</label>
                <input type="text" name="drive" value={form.drive} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Fuel Type</label>
                <input type="text" name="fuelType" value={form.fuelType} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Engine</label>
                <input type="text" name="engine" value={form.engine} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Status</label>
                <input type="text" name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={2} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Vehicle Image</label>
              <div className="flex items-center space-x-4">
                <label htmlFor="vehicle-image-upload" className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer font-semibold hover:bg-purple-700 transition">
                  Choose file
                </label>
                <input
                  id="vehicle-image-upload"
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
                      onClick={() => {
                        setSelectedFile(null);
                        setImagePreview(null);
                        document.getElementById('vehicle-image-upload').value = '';
                      }}
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
            <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded font-semibold hover:bg-purple-700 transition" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Vehicle'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 