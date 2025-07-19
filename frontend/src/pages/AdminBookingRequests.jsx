import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/common/AdminSidebar';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getAllBookingsAdmin, adminUpdateBookingStatus } from '../services/bookings';

export default function AdminBookingRequests() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    setLoading(true);
    getAllBookingsAdmin()
      .then(res => setBookings(res.data))
      .catch(() => setError('Failed to fetch bookings.'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleStatus = async (id, status) => {
    setActionLoading(id + status);
    setError('');
    try {
      await adminUpdateBookingStatus(id, status);
      setBookings(bookings => bookings.map(b => b._id === id ? { ...b, status } : b));
    } catch (err) {
      setError('Failed to update booking status.');
    } finally {
      setActionLoading(null);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500 mb-2">Not authorized</div>
            <div className="text-gray-500">You do not have permission to view this page.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Booking Status</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="bg-white rounded-xl shadow p-8">
            <div className="text-lg font-semibold mb-6">Current Booking Status</div>
            {bookings.length === 0 && (
              <div className="text-gray-400 text-sm">No booking requests found.</div>
            )}
            <div className="flex flex-col divide-y divide-gray-200">
              {bookings.map((b, i) => (
                <div key={b._id} className="flex justify-between items-start py-6">
                  <div>
                    <div className="font-semibold text-lg mb-1">
                      {b.item ? `${b.item.brand} ${b.item.model}` : b.vehicle ? `${b.vehicle.brand} ${b.vehicle.model}` : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-700 mb-1">{b.user?.name}</div>
                    <div className="text-xs text-gray-500 mb-1">{b.user?.email}</div>
                    <div className="text-xs text-gray-500 mb-1">Pickup: {b.pickupLocation}</div>
                    <div className="text-xs text-gray-500">Phone: {b.user?.phoneNumber}</div>
                    <div className="text-xs text-gray-500 font-semibold mt-1">Amount: Rs {b.totalPrice}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-semibold text-base text-gray-800 mb-2">
                      {b.durationInDays} days
                    </span>
                    {b.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50 text-xs"
                          disabled={actionLoading === b._id + 'confirmed'}
                          onClick={() => handleStatus(b._id, 'confirmed')}
                        >
                          {actionLoading === b._id + 'confirmed' ? 'Approving...' : 'Approve'}
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50 text-xs"
                          disabled={actionLoading === b._id + 'cancelled'}
                          onClick={() => handleStatus(b._id, 'cancelled')}
                        >
                          {actionLoading === b._id + 'cancelled' ? 'Rejecting...' : 'Reject'}
                        </button>
                      </div>
                    )}
                    {b.status === 'confirmed' && (
                      <div className="flex gap-2">
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50 text-xs"
                          disabled={actionLoading === b._id + 'completed'}
                          onClick={() => handleStatus(b._id, 'completed')}
                        >
                          {actionLoading === b._id + 'completed' ? 'Completing...' : 'Mark as Completed'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 