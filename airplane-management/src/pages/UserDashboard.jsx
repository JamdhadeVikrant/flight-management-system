import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserBookings, cancelBooking } from '../services/bookingService';
import Spinner from '../components/Spinner';
import { MdFlight, MdCancel } from 'react-icons/md';
import { FiCalendar, FiUser, FiPhone } from 'react-icons/fi';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
};

export default function UserDashboard() {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getUserBookings(currentUser.uid);
      setBookings(data.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (booking) => {
    if (!window.confirm('Cancel this booking?')) return;
    setCancelling(booking.id);
    try {
      await cancelBooking(booking.id, booking.flightId);
      toast.success('Booking cancelled');
      load();
    } catch {
      toast.error('Failed to cancel');
    } finally {
      setCancelling(null);
    }
  };

  const active = bookings.filter(b => b.status === 'confirmed');
  const cancelled = bookings.filter(b => b.status === 'cancelled');

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
              {currentUser?.displayName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-xl font-bold">Welcome, {currentUser?.displayName || 'Traveler'}</h1>
              <p className="text-blue-200 text-sm">{currentUser?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{bookings.length}</p>
              <p className="text-blue-200 text-xs">Total Trips</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{active.length}</p>
              <p className="text-blue-200 text-xs">Upcoming</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{cancelled.length}</p>
              <p className="text-blue-200 text-xs">Cancelled</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4">My Bookings</h2>

        {loading ? (
          <Spinner text="Loading your bookings..." />
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-xl font-semibold text-gray-700">No bookings yet</h3>
            <p className="text-gray-400 mt-2">Start exploring flights and book your next adventure!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => (
              <div key={b.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <MdFlight className="rotate-45 text-blue-300" />
                    <span className="font-semibold">{b.airline}</span>
                    <span className="text-blue-300 bg-blue-800 px-2 py-0.5 rounded-full text-xs">{b.flightNumber}</span>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[b.status]}`}>
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-800">{b.from}</p>
                      <p className="text-xs text-gray-500">{b.departureTime}</p>
                    </div>
                    <div className="flex-1 mx-4 flex flex-col items-center">
                      <div className="flex items-center w-full">
                        <div className="h-px flex-1 bg-gray-200" />
                        <MdFlight className="text-blue-400 rotate-90 mx-2" />
                        <div className="h-px flex-1 bg-gray-200" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-800">{b.to}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-600 border-t pt-3">
                    <span className="flex items-center gap-1"><FiCalendar size={13} /> {b.date}</span>
                    <span className="flex items-center gap-1"><FiUser size={13} /> {b.passenger?.name}</span>
                    <span className="flex items-center gap-1"><FiPhone size={13} /> {b.passenger?.phone}</span>
                    <span className="font-bold text-blue-600">₹{Number(b.price).toLocaleString('en-IN')}</span>
                  </div>
                  {b.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancel(b)}
                      disabled={cancelling === b.id}
                      className="mt-3 flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {cancelling === b.id
                        ? <span className="h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        : <MdCancel />}
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
