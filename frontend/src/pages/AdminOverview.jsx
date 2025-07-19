import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/common/AdminSidebar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// Chart library import will be added after installation
import { getAdminStats, getAllBookingsAdmin } from '../services/bookings';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { FaBell } from 'react-icons/fa';

const statusBadge = (status) => {
  const base = 'px-2 py-1 rounded-full text-xs font-semibold';
  if (status === 'completed') return <span className={base + ' bg-green-100 text-green-700'}>Completed</span>;
  if (status === 'confirmed') return <span className={base + ' bg-blue-100 text-blue-700'}>In progress</span>;
  if (status === 'cancelled') return <span className={base + ' bg-red-100 text-red-700'}>Cancelled</span>;
  return <span className={base + ' bg-gray-100 text-gray-700'}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};

export default function AdminOverview() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getAdminStats()
      .then(res => {
        setSalesData(res.data.salesChart || []);
        setError("");
      })
      .catch((err) => {
        setSalesData([]);
        setError(err.response?.data?.message || err.message || 'Failed to load admin stats.');
      });
    getAllBookingsAdmin()
      .then(res => {
        setBookings(res.data || []);
        setTransactions(res.data || []);
      })
      .catch(() => {
        setBookings([]);
        setTransactions([]);
      })
      .finally(() => setLoading(false));
  }, []);

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

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500 mb-2">Error</div>
            <div className="text-gray-500">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="flex items-center justify-between px-8 py-5 bg-white border-b shadow-sm mb-4">
          <div className="flex items-center gap-4">
            <span className="text-xl font-semibold text-gray-700">Welcome, {user?.name || 'Admin'}!</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="w-10 h-10 bg-purple-50 hover:bg-purple-100 rounded-full flex items-center justify-center shadow transition">
              <FaBell className="text-purple-500 text-lg" />
            </button>
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="avatar" className="w-10 h-10 rounded-full border-2 border-purple-200 shadow" />
          </div>
        </div>
        {/* Main content */}
        <div className="p-8 space-y-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="font-semibold mb-4">Sales</div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => `Sales: ${value.toLocaleString()}`}/>
                  <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Booking Status */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="font-semibold mb-4">Booking Status</div>
            {bookings.length === 0 && <div className="text-gray-400 text-sm">No booking requests found.</div>}
            <div className="flex flex-col divide-y divide-gray-200">
              {bookings.slice(0, 3).map((b, i) => (
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
                    <span className="font-semibold text-base text-gray-800 mb-2">{b.durationInDays} days</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Transactions */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="font-semibold mb-4">Transactions</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-base">
                <thead>
                  <tr className="text-left text-gray-500 bg-gray-50">
                    <th className="py-5 px-4 font-semibold">Transaction</th>
                    <th className="py-5 px-4 font-semibold">Date & Time</th>
                    <th className="py-5 px-4 font-semibold">Amount</th>
                    <th className="py-5 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 && (
                    <tr><td colSpan={4} className="text-center text-gray-400 py-4">No transactions found.</td></tr>
                  )}
                  {transactions.slice(0, 5).map((t, i) => {
                    const userName = t.user?.name ? t.user.name.charAt(0).toUpperCase() + t.user.name.slice(1) : '';
                    let desc = '';
                    if (t.status === 'cancelled') {
                      desc = `Payment failed from ${userName}`;
                    } else if (t.status === 'refunded') {
                      desc = `Payment refund to #${t._id?.slice(-5)}`;
                    } else {
                      desc = `Payment from ${userName}`;
                    }
                    const dateStr = t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
                    return (
                      <tr key={t._id} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                        <td className="py-5 px-4">
                          {t.status === 'cancelled' ? (
                            <span>Payment failed from <b>{userName}</b></span>
                          ) : desc.includes('#') ? (
                            <span dangerouslySetInnerHTML={{ __html: desc.replace(/(#[0-9]+)/g, '<b>$1</b>') }} />
                          ) : (
                            <span>
                              Payment from <b>{userName}</b>
                            </span>
                          )}
                        </td>
                        <td className="py-5 px-4">{dateStr}</td>
                        <td className="py-5 px-4 font-semibold">Rs.{t.totalPrice}</td>
                        <td className="py-5 px-4">{statusBadge(t.status)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Footer */}
        <footer className="text-center text-xs text-gray-400 py-4">
          © 2025 ProRentals., All rights reserved.
          <span className="ml-2">
            <i className="fab fa-facebook mx-1"></i>
            <i className="fab fa-twitter mx-1"></i>
            <i className="fab fa-dribbble mx-1"></i>
          </span>
        </footer>
      </div>
    </div>
  );
} 