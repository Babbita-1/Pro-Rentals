import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams, useNavigate } from "react-router-dom";
import { getItemById } from "../../services/items";
import LoadingSpinner from "../common/LoadingSpinner";
import { toast } from "react-toastify";
import { getMyBookings } from "../../services/bookings";
import { useAuth } from "../../contexts/AuthContext";

/**
 * ItemDetail fetches and displays details for a single item by ID.
 */
const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [userBookings, setUserBookings] = useState([]);
  const { user, loading: authLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    getItemById(id)
      .then(res => {
        setItem(res.data);
        setMainImage(res.data.images && res.data.images.length > 0 ? res.data.images[0] : res.data.imageUrl);
      })
      .catch(() => setError("Failed to load item details"))
      .finally(() => setLoading(false));
    // Only fetch user bookings if logged in and auth is not loading
    if (!authLoading && user) {
      getMyBookings().then(res => setUserBookings(res.data || []));
    }
  }, [id, user, authLoading]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!item) return <div className="text-gray-500 text-center py-8">Item not found.</div>;

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

  const alreadyOrdered = userBookings.some(b => b.item && b.item._id === item._id && b.source === 'form');

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
      {/* Left: Images */}
      <div>
        {mainImage && (
          <>
            <img 
              src={mainImage} 
              alt={item.brand + ' ' + item.model} 
              className="w-64 h-48 object-cover rounded-xl mb-4 bg-gray-100 mx-auto cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            />
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={() => setIsModalOpen(false)}>
                <img
                  src={mainImage}
                  alt={item.brand + ' ' + item.model + ' full size'}
                  className="max-w-3xl max-h-[90vh] rounded shadow-lg border-4 border-white"
                  onClick={e => e.stopPropagation()}
                />
                <button
                  className="absolute top-6 right-8 text-white text-4xl font-bold bg-black bg-opacity-40 rounded-full px-3 py-1 hover:bg-opacity-70"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>
            )}
          </>
        )}
        {/* Thumbnails */}
        <div className="flex gap-3 mt-2 justify-center">
          {(item.images && item.images.length > 0 ? item.images : [item.imageUrl]).map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={item.brand + ' ' + item.model + ' thumbnail'}
              className={`w-20 h-14 object-cover rounded cursor-pointer border ${mainImage === img ? 'border-blue-600' : 'border-gray-300'}`}
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
      </div>
      {/* Right: Info */}
      <div>
        <div className="border-b pb-4 mb-4">
          <h2 className="font-bold text-2xl text-blue-900 mb-2">{item.brand} {item.model}</h2>
          <div className="flex items-center gap-4 mb-2">
            <div className="text-md font-semibold">Status: <span className="text-black">{displayStatus}</span></div>
          </div>
        <div className="text-md font-semibold mb-1">Price Per Day: <span className="text-black">NPR {item.pricePerHour}</span></div>
        </div>
        <button
          className="bg-purple-700 text-white px-6 py-2 rounded font-semibold mb-8 hover:bg-purple-800 transition"
          onClick={() => {
            if (displayStatus !== "Available") {
              toast.error('This item is not available for rent');
              return;
            }
            navigate(`/book/item/${item._id}`);
          }}
          disabled={displayStatus !== "Available"}
        >
          Rent Now
        </button>
        <div className="mt-8">
          <h3 className="font-bold text-xl mb-4">Description</h3>
          <p className="text-gray-700 text-lg">{item.description}</p>
        </div>
      </div>
    </div>
  );
};

ItemDetail.propTypes = {
  item: PropTypes.object,
};

export default ItemDetail; 