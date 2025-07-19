import React from "react";
import { useCart } from "../contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getItemById } from "../services/items";
import { getVehicleById } from "../services/vehicles";
import { getMyBookings } from "../services/bookings";
import { useAuth } from "../contexts/AuthContext";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [latestStatuses, setLatestStatuses] = React.useState({});
  const [userBookings, setUserBookings] = React.useState([]);
  const { user, loading: authLoading } = useAuth();

  // Helper function to determine if product is a vehicle or item based on source
  const isVehicleProduct = (product) => product.source === 'vehicle';

  // Helper function to navigate to the correct detail page
  const navigateToDetail = (product) => {
    if (isVehicleProduct(product)) {
      navigate(`/vehicles/${product._id}`);
    } else {
      navigate(`/items/${product._id}`);
    }
  };

  // Fetch user bookings (MyOrder)
  React.useEffect(() => {
    if (!authLoading && user) {
      getMyBookings().then(res => setUserBookings(res.data || []));
    }
  }, [user, authLoading]);

  // Fetch latest status for all products in cart
  React.useEffect(() => {
    async function fetchStatuses() {
      const statusMap = {};
      await Promise.all(cart.map(async (product) => {
        // Find the most recent booking for this product
        const userBooking = userBookings
          .filter(b => ((product.type && b.vehicle && b.vehicle._id === product._id) || (!product.type && b.item && b.item._id === product._id)))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        let displayStatus = 'Available';
        if (userBooking) {
          if (userBooking.status === 'completed') {
            displayStatus = 'Rented';
          } else if (
            userBooking.status === 'cancelled' ||
            userBooking.status === 'pending' ||
            userBooking.status === 'processing'
          ) {
            displayStatus = 'Available';
          } else {
            displayStatus = 'Available';
          }
        }
        statusMap[product._id] = displayStatus;
      }));
      setLatestStatuses(statusMap);
    }
    if (cart.length > 0) fetchStatuses();
  }, [cart, userBookings]);

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <div className="flex flex-col items-center gap-2 mt-4">
          <Link to="/vehicles" className="text-purple-600 hover:underline">Browse Vehicles</Link>
          <Link to="/items" className="text-purple-600 hover:underline">Browse Items</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>
      <button
        className="mb-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        onClick={() => {
          clearCart();
          toast.success("Cart cleared!");
        }}
      >
        Clear Cart
      </button>
      <div className="grid gap-6">
        {cart.map(product => {
          const isVehicleProd = isVehicleProduct(product);
          const displayStatus = latestStatuses[product._id] || product.status || 'Status: N/A';
          return (
            <div
              key={product._id}
              className="flex items-center bg-white rounded-xl shadow p-4 gap-6 cursor-pointer hover:bg-gray-50 transition"
              onClick={e => {
                // Prevent navigation if Remove button is clicked
                if (e.target.closest("button")) return;
                navigateToDetail(product);
              }}
            >
              <img src={product.imageUrl} alt={(product.brand || "") + ' ' + (product.model || "")} className="w-40 h-32 object-cover rounded" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">{product.brand} {product.model} {product.year ? `(${product.year})` : ""}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    isVehicleProd 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {isVehicleProd ? 'Vehicle' : 'Item'}
                  </span>
                </div>
                <p className="text-purple-700 font-semibold mb-1">₨ {product.pricePerHour} / hr</p>
                <p className="text-gray-600 mb-1">{product.description}</p>
                <span className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  displayStatus === 'Available' ? 'bg-green-100 text-green-700' :
                  displayStatus === 'Not Available' || displayStatus === 'Rented' ? 'bg-red-100 text-red-700' :
                  displayStatus === 'New' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {displayStatus}
                </span>
              </div>
              <button
                className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={e => {
                  e.stopPropagation();
                  removeFromCart(product._id);
                  toast.success("Removed from cart!");
                }}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
} 