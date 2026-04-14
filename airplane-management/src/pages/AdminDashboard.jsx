import { useState, useEffect } from 'react';
import { getFlights, addFlight, updateFlight, deleteFlight } from '../services/flightService';
import { getAllBookings } from '../services/bookingService';
import { getPendingAdmins, approveAdmin, rejectAdmin } from '../services/adminService';
import Spinner from '../components/Spinner';
import { MdFlight, MdAdd, MdEdit, MdDelete, MdClose, MdAdminPanelSettings, MdCheckCircle, MdCancel } from 'react-icons/md';
import { FiUsers, FiCalendar, FiDollarSign, FiList, FiBell } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EMPTY_FLIGHT = {
  flightNumber: '', airline: '', from: '', to: '',
  date: '', departureTime: '', arrivalTime: '', duration: '',
  price: '', totalSeats: '', availableSeats: '',
};

const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata',
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Goa',
  'Kochi', 'Lucknow', 'Chandigarh', 'Bhopal', 'Indore'
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('flights');
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FLIGHT);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const [f, b, p] = await Promise.all([getFlights(), getAllBookings(), getPendingAdmins()]);
      setFlights(f);
      setBookings(b);
      setPendingAdmins(p);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FLIGHT); setErrors({}); setModal(true); };
  const openEdit = (f) => { setEditing(f.id); setForm({ ...f }); setErrors({}); setModal(true); };

  const validate = () => {
    const e = {};
    if (!form.flightNumber.trim()) e.flightNumber = 'Required';
    if (!form.airline.trim()) e.airline = 'Required';
    if (!form.from) e.from = 'Required';
    if (!form.to) e.to = 'Required';
    if (form.from && form.to && form.from === form.to) e.to = 'Cannot be same as origin';
    if (!form.date) e.date = 'Required';
    if (!form.price || isNaN(form.price)) e.price = 'Valid price required';
    if (!form.totalSeats || isNaN(form.totalSeats)) e.totalSeats = 'Valid number required';
    if (!form.availableSeats || isNaN(form.availableSeats)) e.availableSeats = 'Valid number required';
    return e;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const data = { ...form, price: Number(form.price), totalSeats: Number(form.totalSeats), availableSeats: Number(form.availableSeats) };
      if (editing) {
        await updateFlight(editing, data);
        toast.success('Flight updated');
      } else {
        await addFlight(data);
        toast.success('Flight added');
      }
      setModal(false);
      load();
    } catch {
      toast.error('Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this flight?')) return;
    try {
      await deleteFlight(id);
      toast.success('Flight deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleApprove = async (uid, name) => {
    try {
      await approveAdmin(uid);
      toast.success(`${name} approved as admin`);
      load();
    } catch (err) {
      console.error('Approve error:', err.code, err.message);
      toast.error(`Approval failed: ${err?.message || err?.code || 'Unknown error'}`, { duration: 6000 });
    }
  };

  const handleReject = async (uid, name) => {
    if (!window.confirm(`Reject ${name}'s admin request? They will be downgraded to a regular user.`)) return;
    try {
      await rejectAdmin(uid);
      toast.success(`${name}'s request rejected`);
      load();
    } catch (err) {
      console.error('Reject error:', err.code, err.message);
      toast.error(`Rejection failed: ${err?.message || err?.code || 'Unknown error'}`, { duration: 6000 });
    }
  };

  const f = (key) => ({ value: form[key], onChange: e => setForm({ ...form, [key]: e.target.value }) });

  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const revenue = confirmedBookings.reduce((sum, b) => sum + Number(b.price || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] rounded-2xl p-6 text-white mb-8">
          <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
          <p className="text-blue-200 text-sm">Manage flights, bookings, and operations</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[
              { icon: <MdFlight />, label: 'Total Flights', val: flights.length },
              { icon: <FiList />, label: 'Total Bookings', val: bookings.length },
              { icon: <FiUsers />, label: 'Active Bookings', val: confirmedBookings.length },
              { icon: <FiBell />, label: 'Pending Admins', val: pendingAdmins.length, alert: pendingAdmins.length > 0 },
            ].map(s => (
              <div key={s.label} className={`rounded-xl p-3 ${s.alert ? 'bg-yellow-400/30 ring-2 ring-yellow-300' : 'bg-white/10'}`}>
                <div className="text-blue-300 text-xl mb-1">{s.icon}</div>
                <p className="text-xl font-bold">{s.val}</p>
                <p className="text-blue-200 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['flights', 'bookings', 'admins'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-5 py-2 rounded-full font-semibold text-sm transition-colors ${tab === t ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              {t === 'admins' ? 'Admin Requests' : t.charAt(0).toUpperCase() + t.slice(1)}
              {t === 'admins' && pendingAdmins.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {pendingAdmins.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? <Spinner text="Loading data..." /> : (
          <>
            {/* Flights Tab */}
            {tab === 'flights' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800">All Flights ({flights.length})</h2>
                  <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                    <MdAdd size={18} /> Add Flight
                  </button>
                </div>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                        <tr>
                          {['Flight', 'Airline', 'Route', 'Date', 'Time', 'Price', 'Seats', 'Actions'].map(h => (
                            <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {flights.length === 0 ? (
                          <tr><td colSpan={8} className="text-center py-10 text-gray-400">No flights added yet</td></tr>
                        ) : flights.map(f => (
                          <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-semibold text-blue-600">{f.flightNumber}</td>
                            <td className="px-4 py-3">{f.airline}</td>
                            <td className="px-4 py-3">{f.from} → {f.to}</td>
                            <td className="px-4 py-3">{f.date}</td>
                            <td className="px-4 py-3 text-gray-500">{f.departureTime}</td>
                            <td className="px-4 py-3 font-semibold">₹{Number(f.price).toLocaleString('en-IN')}</td>
                            <td className="px-4 py-3">
                              <span className={`font-medium ${f.availableSeats < 10 ? 'text-red-500' : 'text-green-600'}`}>
                                {f.availableSeats}/{f.totalSeats}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button onClick={() => openEdit(f)} className="text-blue-500 hover:text-blue-700 p-1 rounded transition-colors">
                                  <MdEdit size={18} />
                                </button>
                                <button onClick={() => handleDelete(f.id)} className="text-red-400 hover:text-red-600 p-1 rounded transition-colors">
                                  <MdDelete size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {tab === 'bookings' && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4">All Bookings ({bookings.length})</h2>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                        <tr>
                          {['Flight', 'Route', 'Passenger', 'Phone', 'Date', 'Price', 'Status'].map(h => (
                            <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {bookings.length === 0 ? (
                          <tr><td colSpan={7} className="text-center py-10 text-gray-400">No bookings yet</td></tr>
                        ) : bookings.map(b => (
                          <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-semibold text-blue-600">{b.flightNumber}</td>
                            <td className="px-4 py-3">{b.from} → {b.to}</td>
                            <td className="px-4 py-3">{b.passenger?.name}</td>
                            <td className="px-4 py-3 text-gray-500">{b.passenger?.phone}</td>
                            <td className="px-4 py-3">{b.date}</td>
                            <td className="px-4 py-3 font-semibold">₹{Number(b.price).toLocaleString('en-IN')}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Pending Admin Requests Tab */}
            {tab === 'admins' && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Pending Admin Requests ({pendingAdmins.length})
                </h2>
                {pendingAdmins.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm text-center py-16">
                    <MdAdminPanelSettings className="text-gray-300 text-6xl mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No pending admin requests</p>
                    <p className="text-gray-400 text-sm mt-1">All admin requests have been reviewed</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingAdmins.map(admin => (
                      <div key={admin.id} className="bg-white rounded-2xl shadow-sm border border-yellow-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-5 py-3 flex items-center gap-2">
                          <MdAdminPanelSettings className="text-white text-xl" />
                          <span className="text-white font-semibold text-sm">Admin Request</span>
                          <span className="ml-auto bg-white/30 text-white text-xs px-2 py-0.5 rounded-full">Pending</span>
                        </div>
                        <div className="p-5">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                              {admin.name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{admin.name}</p>
                              <p className="text-gray-500 text-xs">{admin.email}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mb-4">
                            Requested on {new Date(admin.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(admin.uid, admin.name)}
                              className="flex-1 flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 rounded-xl transition-colors"
                            >
                              <MdCheckCircle size={16} /> Approve
                            </button>
                            <button
                              onClick={() => handleReject(admin.uid, admin.name)}
                              className="flex-1 flex items-center justify-center gap-1 bg-red-100 hover:bg-red-200 text-red-600 text-sm font-semibold py-2 rounded-xl transition-colors"
                            >
                              <MdCancel size={16} /> Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Flight Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-gray-800 text-lg">{editing ? 'Edit Flight' : 'Add New Flight'}</h3>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><MdClose size={22} /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Flight Number', key: 'flightNumber', placeholder: 'e.g. SW-101' },
                { label: 'Airline Name', key: 'airline', placeholder: 'e.g. SkyWings' },
                { label: 'Departure Time', key: 'departureTime', placeholder: 'e.g. 06:30' },
                { label: 'Arrival Time', key: 'arrivalTime', placeholder: 'e.g. 08:45' },
                { label: 'Duration', key: 'duration', placeholder: 'e.g. 2h 15m' },
                { label: 'Price (₹)', key: 'price', placeholder: 'e.g. 3499', type: 'number' },
                { label: 'Total Seats', key: 'totalSeats', placeholder: 'e.g. 180', type: 'number' },
                { label: 'Available Seats', key: 'availableSeats', placeholder: 'e.g. 120', type: 'number' },
              ].map(({ label, key, placeholder, type = 'text' }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                  <input {...f(key)} type={type} placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">From (City)</label>
                <select {...f('from')} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select City</option>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
                {errors.from && <p className="text-red-500 text-xs mt-1">{errors.from}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">To (City)</label>
                <select {...f('to')} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select City</option>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
                {errors.to && <p className="text-red-500 text-xs mt-1">{errors.to}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Date</label>
                <input {...f('date')} type="date"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>
              <div className="sm:col-span-2 flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving ? <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (editing ? 'Update Flight' : 'Add Flight')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
