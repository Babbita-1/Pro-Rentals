import React, { useEffect, useState } from "react";
import { getMyBookings, deleteBooking, createBooking } from "../services/bookings";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { emptyStates } from "../utils/emptyStates";
import { useNavigate } from "react-router-dom";
import { getItems } from "../services/items";
import { getVehicles } from "../services/vehicles";
import { FaBoxOpen, FaCarSide } from "react-icons/fa";
import { toast } from "react-toastify";

const statusBadge = (status) => {
  const base =
    "inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide border transition-colors duration-200";
  if (status === "completed")
    return (
      <span className={base + " bg-green-100 text-green-700 border-green-200"}>
        Completed
      </span>
    );
  if (status === "confirmed")
    return (
      <span className={base + " bg-blue-100 text-blue-700 border-blue-200"}>
        In Progress
      </span>
    );
  if (status === "cancelled")
    return (
      <span className={base + " bg-red-100 text-red-700 border-red-200"}>
        Cancelled
      </span>
    );
  return (
    <span className={base + " bg-yellow-100 text-yellow-700 border-yellow-200"}>
      Pending
    </span>
  );
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [rerentLoading, setRerentLoading] = useState(null);
  const navigate = useNavigate();
  const [allItems, setAllItems] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getMyBookings(),
      getItems(1, 1000, ""),
      getVehicles(1, 1000, "")
    ])
      .then(([bookingsRes, itemsRes, vehiclesRes]) => {
        setBookings(bookingsRes.data || []);
        setAllItems(itemsRes.data.items || []);
        setAllVehicles(vehiclesRes.data.vehicles || []);
      })
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (id) => {
    toast.dismiss();
    toast.info("Removing order...", { autoClose: 1200 });
    setRemovingId(id);
    try {
      await deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b._id !== id));
      toast.dismiss();
      toast.success("Order removed successfully!");
    } catch (err) {
      toast.dismiss();
      if (err.response && err.response.status === 404) {
        setBookings((prev) => prev.filter((b) => b._id !== id));
        toast.info("Order was already removed.");
      } else {
        setError("Failed to remove order.");
      }
    } finally {
      setRemovingId(null);
    }
  };

  const handleRerent = (booking) => {
    if (booking.item) {
      navigate(`/book/item/${booking.item._id}`);
    } else if (booking.vehicle) {
      navigate(`/book/vehicle/${booking.vehicle._id}`);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) {
    toast.dismiss();
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }
  if (!bookings.length)
    return (
      <div className="text-gray-500 text-center py-8">
        {emptyStates.bookings || "No orders found."}
      </div>
    );

  // Only show bookings created from the booking forms
  const filteredBookings = bookings.filter((b) => b.source === "form");
  const itemBookings = filteredBookings.filter((b) => b.item);
  const vehicleBookings = filteredBookings.filter((b) => b.vehicle);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 pb-16">
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">
            My Orders
          </h2>
          <div className="text-gray-500 text-lg">
            You have {filteredBookings.length} order
            {filteredBookings.length !== 1 ? "s" : ""} in total
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Item Orders Column */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <FaBoxOpen className="text-purple-500 text-xl" />
              <h3 className="text-2xl font-semibold text-gray-700">Item Orders</h3>
            </div>
            {itemBookings.length === 0 && (
              <div className="text-gray-400 mb-6 text-center">
                No item orders found.
              </div>
            )}
            <div className="flex flex-col gap-6">
              {itemBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-200 p-6 flex flex-col md:flex-row items-center gap-6 border border-gray-100"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={booking.item?.imageUrl || "/placeholder.png"}
                      alt={booking.item?.brand + " " + booking.item?.model}
                      className="w-40 h-32 object-cover rounded-lg border border-gray-200 bg-gray-100"
                      onError={(e) => (e.target.src = "/placeholder.png")}
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="font-bold text-lg text-gray-800">
                        {booking.item?.brand} {booking.item?.model}
                      </div>
                      <div>{statusBadge(booking.status)}</div>
                    </div>
                    <div className="text-gray-600 mt-2 mb-1 text-sm">
                      Duration: <span className="font-medium">{booking.durationInDays} days</span>
                    </div>
                    <div className="text-gray-600 mb-1 text-sm">
                      Pickup: <span className="font-medium">{booking.pickupLocation}</span>
                    </div>
                    <div className="text-gray-600 mb-1 text-sm">
                      Total: <span className="font-medium">NPR {booking.totalPrice}</span>
                    </div>
                    {booking.item?.description && (
                      <div className="text-gray-400 text-xs mt-2 line-clamp-2">
                        {booking.item.description}
                      </div>
                    )}
                    <div className="flex gap-3 mt-4">
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition disabled:opacity-60"
                        onClick={() => handleRemove(booking._id)}
                        disabled={removingId === booking._id}
                      >
                        {removingId === booking._id ? "Removing..." : "Remove"}
                      </button>
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition disabled:opacity-60"
                        onClick={() => handleRerent(booking)}
                        disabled={rerentLoading === booking._id}
                      >
                        Rerent
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Divider for mobile */}
          <div className="block md:hidden my-8 border-t border-gray-200"></div>
          {/* Vehicle Orders Column */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <FaCarSide className="text-purple-500 text-xl" />
              <h3 className="text-2xl font-semibold text-gray-700">Vehicle Orders</h3>
            </div>
            {vehicleBookings.length === 0 && (
              <div className="text-gray-400 mb-6 text-center">
                No vehicle orders found.
              </div>
            )}
            <div className="flex flex-col gap-6">
              {vehicleBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-200 p-6 flex flex-col md:flex-row items-center gap-6 border border-gray-100"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={booking.vehicle?.imageUrl || "/placeholder.png"}
                      alt={booking.vehicle?.brand + " " + booking.vehicle?.model}
                      className="w-40 h-32 object-cover rounded-lg border border-gray-200 bg-gray-100"
                      onError={(e) => (e.target.src = "/placeholder.png")}
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="font-bold text-lg text-gray-800">
                        {booking.vehicle?.brand} {booking.vehicle?.model}
                      </div>
                      <div>{statusBadge(booking.status)}</div>
                    </div>
                    <div className="text-gray-600 mt-2 mb-1 text-sm">
                      Duration: <span className="font-medium">{booking.durationInDays} days</span>
                    </div>
                    <div className="text-gray-600 mb-1 text-sm">
                      Pickup: <span className="font-medium">{booking.pickupLocation}</span>
                    </div>
                    <div className="text-gray-600 mb-1 text-sm">
                      Total: <span className="font-medium">NPR {booking.totalPrice}</span>
                    </div>
                    {booking.vehicle?.description && (
                      <div className="text-gray-400 text-xs mt-2 line-clamp-2">
                        {booking.vehicle.description}
                      </div>
                    )}
                    <div className="flex gap-3 mt-4">
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition disabled:opacity-60"
                        onClick={() => handleRemove(booking._id)}
                        disabled={removingId === booking._id}
                      >
                        {removingId === booking._id ? "Removing..." : "Remove"}
                      </button>
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition disabled:opacity-60"
                        onClick={() => handleRerent(booking)}
                        disabled={rerentLoading === booking._id}
                      >
                        Rerent
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 