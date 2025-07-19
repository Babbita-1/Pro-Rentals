import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookingById } from "../../services/bookings";
import LoadingSpinner from "../common/LoadingSpinner";

export default function VehicleCheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getBookingById(id)
      .then(res => {
        if (!res.data.vehicle) {
          setError("This checkout page is only for vehicle bookings.");
        } else {
          setBooking(res.data);
        }
      })
      .catch(() => setError("Failed to load booking details"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!booking) return <div className="text-gray-500 text-center py-8">Booking not found.</div>;

  const startDate = new Date(booking.startDate).toLocaleDateString("en-GB");
  const endDate = new Date(booking.endDate).toLocaleDateString("en-GB");
  const product = booking.vehicle;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-6">Vehicle Checkout</h2>
      <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-6 items-center mb-8">
        <img src={product?.imageUrl} alt={(product?.brand || "") + ' ' + (product?.model || "")} className="w-40 h-32 object-cover rounded" />
        <div className="flex-1">
          <h3 className="font-bold text-xl mb-2">{product?.brand} {product?.model} {product?.year ? `(${product?.year})` : ""}</h3>
          <p className="text-gray-600 mb-1">Start: {startDate}</p>
          <p className="text-gray-600 mb-1">End: {endDate}</p>
          <p className="text-gray-600 mb-1">Duration: {booking.durationInDays} days</p>
          <p className="text-gray-600 mb-1">Pickup: {booking.pickupLocation}</p>
          <p className="text-purple-700 font-semibold mb-1">Total: NPR {booking.totalPrice}</p>
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <button
          className="bg-purple-600 text-white px-6 py-2 rounded font-semibold hover:bg-purple-700 transition"
          onClick={() => navigate(`/book/vehicle/${product._id}`)}
        >
          Rent Now
        </button>
      </div>
    </div>
  );
} 