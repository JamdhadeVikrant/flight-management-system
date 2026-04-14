import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { createBooking } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import { MdFlight, MdAirlineSeatReclineNormal } from 'react-icons/md';
import { FiUser, FiPhone, FiMail, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Booking() {
  const { flightId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [passenger, setPassenger] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    age: '',
    gender: 'Male',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getDoc(doc(db, 'flights', flightId)).then(snap => {
      if (snap.exists()) setFlight({ id: snap.id, ...snap.data() });
      setLoading(false);
    });
  }, [flightId]);

  const validate = () => {
    const e = {};
    if (!passenger.name.trim()) e.name = 'Name required';
    if (!passenger.email) e.email = 'Email required';
    if (!passenger.phone || !/^\d{10}$/.test(passenger.phone)) e.phone = 'Valid 10-digit phone required';
    if (!passenger.age || passenger.age < 1 || passenger.age > 120) e.age = 'Valid age required';
    return e;
  };

  const handleBook = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (flight.availableSeats < 1) { toast.error('No seats available'); return; }

    setSubmitting(true);
    try {
      await createBooking({
        userId: currentUser.uid,
        flightId: flight.id,
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        from: flight.from,
        to: flight.to,
        date: flight.date,
        departureTime: flight.departureTime,
        price: flight.price,
        passenger,
        bookingDate: new Date().toISOString(),
      });
      toast.success('Booking confirmed! 🎉');
      navigate('/dashboard');
    } catch {
      toast.error('Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner text="Loading flight details..." />;
  if (!flight) return <div className="text-center py-20 text-gray-500">Flight not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
                <FiUser className="text-blue-600" /> Passenger Details
              </h2>
              <form onSubmit={handleBook} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      <input
                        value={passenger.name}
                        onChange={e => setPassenger({ ...passenger, name: e.target.value })}
                        placeholder="As on ID proof"
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      <input
                        type="email"
                        value={passenger.email}
                        onChange={e => setPassenger({ ...passenger, email: e.target.value })}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      <input
                        value={passenger.phone}
                        onChange={e => setPassenger({ ...passenger, phone: e.target.value })}
                        placeholder="10-digit mobile"
                        maxLength={10}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      value={passenger.age}
                      onChange={e => setPassenger({ ...passenger, age: e.target.value })}
                      placeholder="Age"
                      min={1} max={120}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={passenger.gender}
                      onChange={e => setPassenger({ ...passenger, gender: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
                  ⚠️ Please ensure passenger details match your government-issued ID proof.
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {submitting
                    ? <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : `Confirm Booking — ₹${Number(flight.price).toLocaleString('en-IN')}`}
                </button>
              </form>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Flight Summary</h3>
              <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] rounded-xl p-4 text-white mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <MdFlight className="rotate-45 text-blue-300" />
                  <span className="font-semibold text-sm">{flight.airline}</span>
                  <span className="text-xs bg-blue-800 px-2 py-0.5 rounded-full">{flight.flightNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">{flight.from}</p>
                    <p className="text-blue-300 text-xs">{flight.departureTime}</p>
                  </div>
                  <MdFlight className="rotate-90 text-blue-300" size={20} />
                  <div className="text-right">
                    <p className="text-2xl font-bold">{flight.to}</p>
                    <p className="text-blue-300 text-xs">{flight.arrivalTime}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1"><FiCalendar size={13} /> Date</span>
                  <span className="font-medium">{flight.date}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1"><MdAirlineSeatReclineNormal size={14} /> Seats Left</span>
                  <span className="font-medium text-green-600">{flight.availableSeats}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-gray-800">
                  <span>Total Amount</span>
                  <span className="text-blue-600 text-lg">₹{Number(flight.price).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
