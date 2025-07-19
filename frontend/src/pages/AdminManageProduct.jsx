import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/common/AdminSidebar';
import { getItems, deleteItem, updateItem, getItemById } from '../services/items';
import { getVehicles, deleteVehicle, updateVehicle, getVehicleById } from '../services/vehicles';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

export default function AdminManageProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '' });
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [itemsRes, vehiclesRes] = await Promise.all([
        getItems(1, 100),
        getVehicles(1, 100),
      ]);
      const items = (itemsRes.data.items || []).map(item => ({
        id: item._id,
        name: `${item.brand} ${item.model}`,
        brand: item.brand,
        model: item.model,
        type: 'Item',
        price: item.pricePerHour,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
      const vehicles = (vehiclesRes.data.vehicles || []).map(vehicle => ({
        id: vehicle._id,
        name: `${vehicle.brand} ${vehicle.model}`,
        brand: vehicle.brand,
        model: vehicle.model,
        type: 'Vehicle',
        price: vehicle.pricePerHour,
        createdAt: vehicle.createdAt,
        updatedAt: vehicle.updatedAt,
      }));
      const allProducts = [...items, ...vehicles];
      allProducts.sort((a, b) => {
        if (a.updatedAt && b.updatedAt) {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        } else if (a.updatedAt) {
          return -1;
        } else if (b.updatedAt) {
          return 1;
        } else {
          return 0;
        }
      });
      setProducts(allProducts);
    } catch (err) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (product) => {
    if (!window.confirm(`Are you sure you want to delete ${product.name}?`)) return;
    try {
      if (product.type === 'Item') {
        await deleteItem(product.id);
      } else if (product.type === 'Vehicle') {
        await deleteVehicle(product.id);
      }
      toast.success(`${product.type} '${product.name}' deleted successfully!`);
      fetchProducts();
    } catch (err) {
      toast.error(`Failed to delete ${product.type} '${product.name}'.`);
    }
  };

  const openEditModal = async (product) => {
    let details = product;
    if (product.type === 'Item') {
      const res = await getItemById(product.id);
      details = res.data;
    } else if (product.type === 'Vehicle') {
      const res = await getVehicleById(product.id);
      details = res.data;
    }
    setEditProduct(product);
    setEditForm({
      brand: details.brand || '',
      model: details.model || '',
      year: details.year || '',
      pricePerHour: details.pricePerHour || details.price || '',
      description: details.description || '',
      imageUrl: details.imageUrl || '',
      // Vehicle fields
      type: details.type || '',
      seat: details.seat || '',
      door: details.door || '',
      luggage: details.luggage || '',
      transmission: details.transmission || '',
      drive: details.drive || '',
      fuelType: details.fuelType || '',
      engine: details.engine || '',
    });
    setEditImage(null);
    setEditImagePreview(details.imageUrl || null);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditProduct(null);
    setEditForm({ name: '', price: '' });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    setEditImage(file);
    if (file) {
      setEditImagePreview(URL.createObjectURL(file));
    } else {
      setEditImagePreview(null);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editProduct) return;
    try {
      let payload = { ...editForm };
      if (editProduct.type === 'Item') {
        payload.price = payload.pricePerHour;
        if (editImage) {
          payload.imageUrl = `/item-images/${editImage.name}`;
        }
        await updateItem(editProduct.id, payload);
      } else if (editProduct.type === 'Vehicle') {
        payload.price = payload.pricePerHour;
        if (editImage) {
          payload.imageUrl = `/vehicle-images/${editImage.name}`;
        }
        await updateVehicle(editProduct.id, payload);
      }
      toast.success(`${editProduct.type} updated successfully!`);
      closeEditModal();
      fetchProducts();
    } catch (err) {
      toast.error(`Failed to update ${editProduct.type}.`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8 flex justify-center items-start">
        <div className="bg-white rounded-xl shadow-md w-full max-w-5xl">
          <div className="flex justify-between items-center px-8 py-6 border-b">
            <h2 className="text-2xl font-bold">All Products</h2>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12"><LoadingSpinner /></div>
            ) : (
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-5 px-8 font-semibold">S.N</th>
                    <th className="py-5 px-8 font-semibold">PRODUCTS</th>
                    <th className="py-5 px-8 font-semibold">TYPE</th>
                    <th className="py-5 px-8 font-semibold">PRICE</th>
                    <th className="py-5 px-8 font-semibold">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, idx) => (
                    <tr key={product.id} className="border-b last:border-b-0">
                      <td className="py-5 px-8 font-bold">{idx + 1}</td>
                      <td className="py-5 px-8">{product.name}</td>
                      <td className="py-5 px-8">{product.type}</td>
                      <td className="py-5 px-8">Rs {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</td>
                      <td className="py-5 px-8 flex gap-3">
                        <button className="text-purple-600 font-semibold hover:underline" onClick={() => openEditModal(product)}>Edit</button>
                        <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-5 rounded-full transition" onClick={() => handleDelete(product)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        {/* Edit Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-8 py-5 rounded-t-2xl bg-gradient-to-r from-purple-600 to-blue-500">
                <h3 className="text-xl font-bold text-white">Edit {editProduct.type}</h3>
                <button onClick={closeEditModal} className="text-white text-2xl font-bold hover:text-red-200 focus:outline-none">&times;</button>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-6 px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-1 font-medium">Brand</label>
                    <input type="text" name="brand" value={editForm.brand} onChange={handleEditChange} className="w-full border rounded px-3 py-2" required />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Model</label>
                    <input type="text" name="model" value={editForm.model} onChange={handleEditChange} className="w-full border rounded px-3 py-2" required />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Year</label>
                    <input type="number" name="year" value={editForm.year} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Price Per Hour</label>
                    <input type="number" name="pricePerHour" value={editForm.pricePerHour} onChange={handleEditChange} className="w-full border rounded px-3 py-2" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea name="description" value={editForm.description} onChange={handleEditChange} className="w-full border rounded px-3 py-2" rows={2} />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Status</label>
                    <input type="text" name="status" value={editForm.status} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
                  </div>
                  {editProduct.type === 'Vehicle' && <>
                    <div>
                      <label className="block mb-1 font-medium">Type</label>
                      <input type="text" name="type" value={editForm.type} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Seat</label>
                      <input type="number" name="seat" value={editForm.seat} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Door</label>
                      <input type="number" name="door" value={editForm.door} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Luggage</label>
                      <input type="text" name="luggage" value={editForm.luggage} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Transmission</label>
                      <input type="text" name="transmission" value={editForm.transmission} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Drive</label>
                      <input type="text" name="drive" value={editForm.drive} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Fuel Type</label>
                      <input type="text" name="fuelType" value={editForm.fuelType} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Engine</label>
                      <input type="text" name="engine" value={editForm.engine} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
                    </div>
                  </>}
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium">Image</label>
                    <div className="flex items-center space-x-4 mb-2">
                      <label htmlFor="edit-image-upload" className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer font-semibold hover:bg-purple-700 transition">
                        Choose file
                      </label>
                      <input
                        id="edit-image-upload"
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleEditImageChange}
                        className="hidden"
                      />
                      <span className="mb-1 font-medium">{editImage ? editImage.name : (editForm.imageUrl ? editForm.imageUrl.split('/').pop() : 'No image chosen')}</span>
                    </div>
                    {editImagePreview && (
                      <div className="mt-2 flex justify-center">
                        <div className="relative inline-block">
                          <img src={editImagePreview} alt="Preview" className="w-64 max-w-full rounded shadow" />
                          <button
                            type="button"
                            onClick={() => { setEditImage(null); setEditImagePreview(null); }}
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
                </div>
                <div className="flex justify-end gap-4 mt-8">
                  <button type="button" className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300" onClick={closeEditModal}>Cancel</button>
                  <button type="submit" className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold hover:from-purple-700 hover:to-blue-600 shadow">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 