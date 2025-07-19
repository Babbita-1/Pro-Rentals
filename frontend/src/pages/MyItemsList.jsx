import React, { useEffect, useState } from "react";
import { getMyItems } from "../services/items";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { emptyStates } from "../utils/emptyStates";

const MyItemsList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getMyItems()
      .then(res => setItems(res.data || []))
      .catch(() => setError("Failed to load your items"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!items.length) return <div className="text-gray-500 text-center py-8">{emptyStates.myItems}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map(item => (
        <div key={item._id} className="bg-white rounded-xl shadow p-4">
          <h3 className="font-bold text-lg mb-2">{item.brand} {item.model}</h3>
          <p className="text-gray-600 mb-2">{item.description}</p>
          <p className="text-purple-700 font-semibold">₨{item.price}</p>
        </div>
      ))}
    </div>
  );
};

export default MyItemsList;
