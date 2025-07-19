import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getVehicles } from "../../services/vehicles";
import LoadingSpinner from "../common/LoadingSpinner";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { toast } from "react-toastify";
import { getMyBookings } from "../../services/bookings";
import { useAuth } from "../../contexts/AuthContext";


const VEHICLES_PER_PAGE = 12;

/**
 * VehicleList fetches and displays a list of vehicles from the backend.
 */
const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cart, addToCart } = useCart();
  const [userBookings, setUserBookings] = useState([]);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    setLoading(true);
    getVehicles(page, VEHICLES_PER_PAGE)
      .then(res => {
        setVehicles(res.data.vehicles || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch(() => setError("Failed to load vehicles"))
      .finally(() => setLoading(false));
    // Only fetch user bookings if logged in and auth is not loading
    if (!authLoading && user) {
      getMyBookings().then(res => setUserBookings(res.data || []));
    }
  }, [page, user, authLoading]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!vehicles.length) return <div className="text-gray-500 text-center py-8">No vehicles found.</div>;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vehicles.map(vehicle => {
          // Find the most recent booking for this vehicle
          const userBooking = userBookings
            .filter(b => b.vehicle && b.vehicle._id === vehicle._id)
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
          return (
            <Link key={vehicle._id} to={`/vehicles/${vehicle._id}`} className="w-full">
              <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-center hover:shadow-2xl transition-shadow duration-200 cursor-pointer">
                {vehicle.imageUrl && (
                  <img src={vehicle.imageUrl} alt={vehicle.brand + ' ' + vehicle.model} className="w-40 h-32 object-cover rounded mb-4" />
                )}
                <h3 className="font-bold text-lg mb-1">{vehicle.brand} {vehicle.model} ({vehicle.year})</h3>
                <p className="text-purple-700 font-semibold mb-1">₨ {vehicle.pricePerHour} / hr</p>
                <p className="text-gray-600 mb-1">Type: {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}</p>
                <p className="text-gray-600 mb-1">{vehicle.description}</p>
                <span className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  displayStatus === 'Available' ? 'bg-green-100 text-green-700' :
                  displayStatus === 'Rented' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>{displayStatus}</span>
                <button
                  className={`mt-2 ml-2 px-4 py-1 rounded-full text-xs font-semibold transition ${cart.some(v => v._id === vehicle._id) ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!cart.some(v => v._id === vehicle._id)) {
                      const vehicleWithStatus = {
                        ...vehicle,
                        status: displayStatus,
                        source: 'vehicle'
                      };
                      addToCart(vehicleWithStatus);
                      toast.success("Added to cart!");
                    }
                  }}
                  disabled={cart.some(v => v._id === vehicle._id)}
                >
                  {cart.some(v => v._id === vehicle._id) ? 'In Cart' : 'Add to Cart'}
                </button>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="flex justify-center items-center gap-4 mt-8">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">Next</button>
      </div>
    </div>
  );
};

VehicleList.propTypes = {
  vehicles: PropTypes.array,
};

export default VehicleList; 