import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getItemById } from "../../services/items";
import { createBooking, getMyItemBookings } from "../../services/bookings";
import LoadingSpinner from "../common/LoadingSpinner";
import { emptyStates } from "../../utils/emptyStates";
import { toast } from "react-toastify";

const rentTypes = ["Whole Day", "Half Day", "Weekly", "Monthly"];

const ItemsBooking = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // Remove isVehicle and vehicle booking logic
  const isBookingForm = location.pathname.startsWith("/book/item/");

  // Booking form state
  const [item, setItem] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", days: "", phone: "", rentType: rentTypes[0], pickupLocation: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Booking list state
  const [bookings, setBookings] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [userBookings, setUserBookings] = useState([]);

  // Calculate total price based on days and item price
  const calculateTotalPrice = () => {
    if (!item || !form.days || isNaN(form.days) || Number(form.days) <= 0) {
      return 0;
    }
    const pricePerHour = item.pricePerHour || 0;
    const days = Number(form.days);
    return pricePerHour * 24 * days;
  };

  const totalPrice = calculateTotalPrice();

  // Fetch for booking form
  useEffect(() => {
    if (!isBookingForm) return;
    setLoading(true);
    getItemById(id)
      .then(res => {
        setItem(res.data);
        setMainImage(res.data.images && res.data.images.length > 0 ? res.data.images[0] : res.data.imageUrl);
      })
      .catch(() => setError("Failed to load details"))
      .finally(() => setLoading(false));
  }, [id, isBookingForm]);

  // Fetch for booking list
  useEffect(() => {
    if (isBookingForm) return;
    setListLoading(true);
    getMyItemBookings()
      .then(res => setBookings(res.data || []))
      .catch(() => setListError("Failed to load bookings on your items"))
      .finally(() => setListLoading(false));
  }, [isBookingForm]);

  // Fetch user's item orders for this item
  useEffect(() => {
    if (isBookingForm) return;
    getMyItemBookings().then(res => {
      setUserOrders((res.data || []).filter(b => b.item && b.item._id === id && b.source === 'form'));
    }).catch(() => {});
  }, [id, isBookingForm]);

  // Fetch user bookings (MyOrder)
  useEffect(() => {
    getMyItemBookings().then(res => setUserBookings(res.data || []));
  }, [id]);

  // Booking form handlers
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const validate = () => {
    if (!form.name || !form.email || !form.days || !form.phone || !form.pickupLocation) return "All fields are required.";
    if (!/^\d{10}$/.test(form.phone)) return "Phone Number Should be 10 digit";
    if (isNaN(Number(form.days)) || Number(form.days) <= 0) return "Enter a valid number of days.";
    return "";
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      toast.error(err);
      return;
    }

    // Block booking only if user has a 'Rented' booking for this item
    const isRented = userBookings.some(
      b => b.item && b.item._id === id && b.status === "Rented" && b.source === "form"
    );
    if (isRented) {
      toast.error('This item is already rented by you');
      return;
    }

    // Check for existing order
    if (userOrders.length > 0) {
      toast.error('Already ordered');
      return;
    }
    try {
      await createBooking({
        item: id,
        startDate: new Date(),
        durationInDays: Number(form.days),
        pickupLocation: form.pickupLocation,
        notes: `Rent type: ${form.rentType}, Name: ${form.name}, Email: ${form.email}, Phone: ${form.phone}`,
        source: 'form'
      });
      setSuccess("Order Placed Sucessfully");
      toast.success("Order Placed Sucessfully");
      setForm({ name: "", email: "", days: "", phone: "", rentType: rentTypes[0], pickupLocation: "" });
      setTimeout(() => navigate(`/my-order`), 1200);
    } catch {
      toast.error("Failed to Placed");
      toast.error("Failed to Placed");
    }
  };

  // Render booking form
  if (isBookingForm) {
    if (loading) return <LoadingSpinner />;
    // Only show full-page error for fetch errors
    if (error === "Failed to load details") return <div className="text-red-500 text-center py-8">{error}</div>;
    if (!item) return <div className="text-gray-500 text-center py-8">Item not found.</div>;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Item</h1>
            <p className="text-lg text-gray-600">Complete your booking details below</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Item Details Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Item Details</h3>
              {mainImage && (
                <div className="mb-6 flex justify-center">
                  <img 
                    src={mainImage} 
                    alt={item.brand + ' ' + item.model} 
                    className="w-64 h-48 object-cover rounded-xl shadow-lg"
                  />
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {item.brand} {item.model}
                  </h4>
                  <p className="text-gray-600">{item.year} • {item.category}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-purple-600 font-medium">Price per Hour</p>
                    <p className="text-2xl font-bold text-purple-900">
                      NPR {item.pricePerHour || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-600 font-medium">Status</p>
                    <p className="text-lg font-semibold text-blue-900">{item.status || 'Available'}</p>
                  </div>
                </div>
                
                {/* Dynamic Price Calculation */}
                {form.days && Number(form.days) > 0 && (
                  <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-green-700 font-medium">Price Calculation:</span>
                      <span className="text-sm text-green-600">
                        {item.pricePerHour} × 24 hours × {form.days} days
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-green-800">Total Price:</span>
                      <span className="text-3xl font-bold text-green-900">
                        NPR {totalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-green-600">
                      {form.days} day{Number(form.days) > 1 ? 's' : ''} rental
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Form Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Booking Information</h3>
              
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">{success}</p>
                </div>
              )}
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input 
                      name="name" 
                      value={form.name} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                      placeholder="Enter your full name" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input 
                      name="email" 
                      type="email" 
                      value={form.email} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                      placeholder="Enter your email" 
                    />
                    <div className="text-xs text-gray-500 mt-1">Need for company? Use Company Email</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input 
                      name="phone" 
                      value={form.phone} 
                      onChange={handleChange} 
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                        form.phone && !/^\d{10}$/.test(form.phone) ? 'border-red-400 focus:ring-red-500' : 'border-gray-300'
                      }`} 
                      placeholder="Enter 10-digit phone number" 
                    />
                    {form.phone && !/^\d{10}$/.test(form.phone) && (
                      <p className="text-red-500 text-sm mt-1">Phone number must be 10 digits</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Rent For *
                    </label>
                    <input 
                      name="days" 
                      type="number" 
                      value={form.days} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                      placeholder="Enter number of days" 
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pickup Location *
                  </label>
                  <input 
                    name="pickupLocation" 
                    value={form.pickupLocation} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                    placeholder="Enter pickup location" 
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button 
                    type="button" 
                    className="flex-1 px-6 py-3 border-2 border-purple-600 text-purple-700 font-semibold rounded-lg hover:bg-purple-50 transition-all duration-200" 
                    onClick={() => window.history.back()}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render booking list
  if (listLoading) return <LoadingSpinner />;
  if (listError) return <div className="text-red-500 text-center py-8">{listError}</div>;
  if (!bookings.length) return <div className="text-gray-500 text-center py-8">{emptyStates.myItemBookings}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Item Bookings</h1>
          <p className="text-lg text-gray-600">Track all your item rental bookings</p>
        </div>
        
        <div className="grid gap-6">
          {bookings.map(booking => (
            <div key={booking._id} className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Item Image */}
                <div className="lg:w-1/3 flex justify-center items-center">
                  <img
                    src={booking.item?.imageUrl || booking.item?.images?.[0] || "/placeholder.png"}
                    alt={booking.item?.brand + ' ' + booking.item?.model}
                    className="w-40 h-32 object-cover rounded-xl shadow-lg"
                  />
                </div>
                
                {/* Booking Details */}
                <div className="lg:w-2/3">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {booking.item?.brand} {booking.item?.model}
                    </h3>
                    <p className="text-gray-600">{booking.item?.year} • {booking.item?.category}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                        <span className="text-gray-700 font-medium">Duration:</span>
                        <span className="ml-auto font-semibold text-gray-900">{booking.durationInDays} days</span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-gray-700 font-medium">Pickup Location:</span>
                        <span className="ml-auto font-semibold text-gray-900">{booking.pickupLocation || 'N/A'}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-gray-700 font-medium">Total Price:</span>
                        <span className="ml-auto font-bold text-green-600 text-lg">NPR {booking.totalPrice || 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                        <span className="text-gray-700 font-medium">Status:</span>
                        <span className={`ml-auto font-bold text-lg ${
                          booking.status === 'confirmed' ? 'text-green-600' : 
                          booking.status === 'cancelled' ? 'text-red-600' : 
                          'text-yellow-600'
                        }`}>
                          {booking.status === 'confirmed' ? 'Confirmed' : 
                           booking.status === 'cancelled' ? 'Cancelled' : 
                           'Pending'}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-indigo-500 rounded-full mr-3"></div>
                        <span className="text-gray-700 font-medium">Booking ID:</span>
                        <span className="ml-auto font-mono text-sm text-gray-500">{booking._id.slice(-8)}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-pink-500 rounded-full mr-3"></div>
                        <span className="text-gray-700 font-medium">Created:</span>
                        <span className="ml-auto text-sm text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemsBooking;
