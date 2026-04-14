import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdFlight, MdFlightLand, MdFlightTakeoff } from 'react-icons/md';
import { FiSearch, FiCalendar } from 'react-icons/fi';

const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata',
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Goa',
  'Kochi', 'Lucknow', 'Chandigarh', 'Bhopal', 'Indore'
];

const FEATURES = [
  { icon: '✈️', title: 'Easy Booking', desc: 'Book flights in under 2 minutes with our streamlined process' },
  { icon: '💺', title: 'Seat Selection', desc: 'Choose your preferred seat from our interactive seat map' },
  { icon: '🔒', title: 'Secure Payments', desc: '100% secure transactions with industry-grade encryption' },
  { icon: '📱', title: '24/7 Support', desc: 'Round-the-clock customer support via chat, call, or email' },
];

export default function Home() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ from: '', to: '', date: '' });
  const [error, setError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!form.from || !form.to || !form.date) {
      setError('Please fill all fields to search flights.');
      return;
    }
    if (form.from === form.to) {
      setError('Origin and destination cannot be the same.');
      return;
    }
    setError('');
    navigate(`/flights?from=${form.from}&to=${form.to}&date=${form.date}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl">✈</div>
          <div className="absolute bottom-10 right-10 text-9xl rotate-180">✈</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
              Fly Smarter with <br />
              <span className="text-blue-300">SkyWings Airlines</span>
            </h1>
            <p className="text-blue-200 text-lg md:text-xl max-w-2xl mx-auto">
              Discover the best fares, seamless booking, and world-class service — all in one place.
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                    <MdFlightTakeoff className="inline mr-1 text-blue-600" /> From
                  </label>
                  <select
                    value={form.from}
                    onChange={e => setForm({ ...form, from: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  >
                    <option value="">Select City</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                    <MdFlightLand className="inline mr-1 text-blue-600" /> To
                  </label>
                  <select
                    value={form.to}
                    onChange={e => setForm({ ...form, to: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  >
                    <option value="">Select City</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                    <FiCalendar className="inline mr-1 text-blue-600" /> Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
              <button
                type="submit"
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-lg"
              >
                <FiSearch /> Search Flights
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-10 border-b">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: '50+', label: 'Destinations' },
            { num: '200+', label: 'Daily Flights' },
            { num: '2M+', label: 'Happy Passengers' },
            { num: '99.2%', label: 'On-Time Rate' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-blue-600">{s.num}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Why Choose SkyWings?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Popular Routes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { from: 'Mumbai', to: 'Delhi', price: '2,499', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80' },
              { from: 'Bangalore', to: 'Goa', price: '1,899', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80' },
              { from: 'Chennai', to: 'Kolkata', price: '3,199', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
            ].map(r => (
              <div
                key={r.from + r.to}
                onClick={() => navigate(`/flights?from=${r.from}&to=${r.to}&date=`)}
                className="relative rounded-2xl overflow-hidden cursor-pointer group h-48"
              >
                <img src={r.img} alt={r.to} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-bold text-lg">{r.from} → {r.to}</p>
                  <p className="text-blue-300 text-sm">From ₹{r.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
