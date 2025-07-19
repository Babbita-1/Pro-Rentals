import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getItems } from "../../services/items";
import LoadingSpinner from "../common/LoadingSpinner";
import { emptyStates } from "../../utils/emptyStates";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { toast } from "react-toastify";
import { getMyBookings } from "../../services/bookings";
import { useAuth } from "../../contexts/AuthContext";


const ITEMS_PER_PAGE = 12;

/**
 * ItemList fetches and displays a list of items from the backend.
 */
const ItemList = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userBookings, setUserBookings] = useState([]);


  const navigate = useNavigate();
  const { cart, addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    getItems(page, ITEMS_PER_PAGE, search)
      .then(res => {
        setItems(res.data.items || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch(() => setError("Failed to load items"))
      .finally(() => setLoading(false));
    // Only fetch user bookings if logged in
    if (user) {
      getMyBookings().then(res => setUserBookings(res.data || []));
    }
  }, [page, search, user]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!items.length) return <div className="text-gray-500 text-center py-8">{emptyStates.items}</div>;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {items.map(item => {
          // Find the most recent booking for this item
          const userBooking = userBookings
            .filter(b => b.item && b.item._id === item._id)
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
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-center hover:shadow-2xl transition-shadow duration-200 cursor-pointer"
              onClick={() => navigate(`/items/${item._id}`)}
            >
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.brand + ' ' + item.model} className="w-40 h-32 object-cover rounded mb-4" />
              )}
              <h3 className="font-bold text-lg mb-1 text-center">{item.brand} {item.model}</h3>
              <p className="text-purple-700 font-semibold mb-1 text-center">₨ {item.pricePerHour !== undefined ? item.pricePerHour : 'Not set'} </p>
              <p className="text-gray-600 mb-2 text-center">{item.description}</p>
              <span className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold ${displayStatus === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{displayStatus}</span>
              <button
                className={`mt-2 px-4 py-1 rounded-full text-xs font-semibold transition ${cart.some(i => i._id === item._id) ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                onClick={e => {
                  e.stopPropagation();
                  if (!cart.some(i => i._id === item._id)) {
                    const itemWithStatus = {
                      ...item,
                      status: item.status || displayStatus,
                      source: 'item'
                    };
                    addToCart(itemWithStatus);
                    toast.success('Added to cart!');
                  }
                }}
                disabled={cart.some(i => i._id === item._id)}
              >
                {cart.some(i => i._id === item._id) ? 'In Cart' : 'Add to Cart'}
              </button>
            </div>
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

ItemList.propTypes = {
  items: PropTypes.array,
};

export default ItemList; 