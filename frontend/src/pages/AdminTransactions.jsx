import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/common/AdminSidebar';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getAllBookingsAdmin } from '../services/bookings';

const statusBadge = (status) => {
  const base = 'px-2 py-1 rounded-full text-xs font-semibold';
  if (status === 'completed') return <span className={base + ' bg-green-100 text-green-700'}>Completed</span>;
  if (status === 'confirmed') return <span className={base + ' bg-blue-100 text-blue-700'}>In progress</span>;
  if (status === 'cancelled') return <span className={base + ' bg-red-100 text-red-700'}>Cancelled</span>;
  return <span className={base + ' bg-gray-100 text-gray-700'}>{status}</span>;
};

export default function AdminTransactions() {
  const { user, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    setLoading(true);
    getAllBookingsAdmin()
      .then(res => setTransactions(res.data))
      .catch(() => setError('Failed to fetch transactions.'))
      .finally(() => setLoading(false));
  }, [user]);

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
          <div className="text-2xl font-bold mb-1 pb-5">Transactions</div>
        <div className="bg-white rounded-xl shadow p-8">
          <div className="text-gray-500 mb-6">This is a list of latest transactions.</div>
          {error && <div className="mb-4 text-red-500">{error}</div>}
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-base">
                <thead>
                  <tr className="text-left text-gray-500 bg-gray-50">
                    <th className="py-3 px-4 font-semibold">Transaction</th>
                    <th className="py-3 px-4 font-semibold">Date & Time</th>
                    <th className="py-3 px-4 font-semibold">Amount</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 && (
                    <tr><td colSpan={4} className="text-center text-gray-400 py-4">No transactions found.</td></tr>
                  )}
                  {transactions.map((t, i) => {
                    // Transaction description logic
                    const userName = t.user?.name ? t.user.name.charAt(0).toUpperCase() + t.user.name.slice(1) : '';
                    let desc = '';
                    if (t.status === 'cancelled') {
                      desc = `Payment failed from ${userName}`;
                    } else if (t.status === 'refunded') {
                      desc = `Payment refund to #${t._id?.slice(-5)}`;
                    } else {
                      desc = `Payment from ${userName}`;
                    }
                    // Date formatting
                    const dateStr = t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
                    return (
                      <tr key={t._id} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                        <td className="py-3 px-4">
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
                        <td className="py-6 px-4">{dateStr}</td>
                        <td className="py-6 px-4 font-semibold">Rs.{t.totalPrice}</td>
                        <td className="py-6 px-4">{statusBadge(t.status)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 