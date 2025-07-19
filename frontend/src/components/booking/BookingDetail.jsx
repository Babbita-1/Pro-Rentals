import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooking(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch booking");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading booking details...</p>;
  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;
  if (!booking) return <p className="text-center mt-10">Booking not found.</p>;

  const startDate = new Date(booking.startDate).toLocaleDateString("en-US");
  const endDate = new Date(booking.endDate).toLocaleDateString("en-US");

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Booking Details</h1>

      <div className="mb-6">
        <Link to="/bookings" className="text-blue-600 hover:underline">
          ← Back to My Bookings
        </Link>
      </div>

      {/* Item Details */}
      <div className="border rounded-lg p-4 mb-6 bg-gray-50">
        <h2 className="text-2xl font-semibold mb-4">Item Information</h2>
        <img
          src={booking.item?.imageUrl || "/placeholder.png"}
          alt={booking.item?.model}
          className="w-64 h-48 object-cover rounded mb-4 mx-auto"
        />
        <p><strong>Brand:</strong> {booking.item?.brand}</p>
        <p><strong>Model:</strong> {booking.item?.model}</p>
        <p><strong>Year:</strong> {booking.item?.year}</p>
        <p><strong>Type:</strong> {booking.item?.type?.name}</p>
        <p><strong>Category:</strong> {booking.item?.type?.category}</p>
        <p className="mt-2">{booking.item?.description}</p>
      </div>

      {/* Booking Details */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h2 className="text-2xl font-semibold mb-4">Booking Information</h2>
        <p><strong>Start Date:</strong> {startDate}</p>
        <p><strong>End Date:</strong> {endDate}</p>
        <p><strong>Duration:</strong> {booking.durationInDays} days</p>
        <p><strong>Total Price:</strong> ${booking.totalPrice.toFixed(2)}</p>
        <p><strong>Status:</strong> {booking.status}</p>
      </div>
    </div>
  );
}

export default BookingDetail;
