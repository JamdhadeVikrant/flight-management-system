import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getFlights, searchFlights } from '../services/flightService';
import FlightCard from '../components/FlightCard';
import Spinner from '../components/Spinner';
import { MdFlightTakeoff, MdFlightLand } from 'react-icons/md';
import { FiSearch, FiCalendar, FiFilter } from 'react-icons/fi';

const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata',
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Goa',
  'Kochi', 'Lucknow', 'Chandigarh', 'Bhopal', 'Indore'
];

export default function Flights() {
  const [searchParams] = useSearchParams();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [sortBy, setSortBy] = useState('price');
  const [form, setForm] = useState({
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    date: searchParams.get('date') || '',
  });

  useEffect(() => {
    if (form.from && form.to && form.date) handleSearch();
    else loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const data = await getFlights();
      setFlights(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const data = form.from && form.to && form.date
        ? await searchFlights(form.from, form.to, form.date)
        : await getFlights();
      setFlights(data);
    } finally {
      setLoading(false);
    }
  };

  const sorted = [...flights].sort((a, b) => {
    if (sortBy === 'price') return Number(a.price) - Number(b.price);
    if (sortBy === 'seats') return Number(b.availableSeats) - Number(a.availableSeats);
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="bg-[#1e3a5f] py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSearch} className="bg-white rounded-2xl p-5 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
                  <MdFlightTakeoff className="inline mr-1 text-blue-600" />From
                </label>
                <select
                  value={form.from}
                  onChange={e => setForm({ ...form, from: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any City</option>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
                  <MdFlightLand className="inline mr-1 text-blue-600" />To
                </label>
                <select
                  value={form.to}
                  onChange={e => setForm({ ...form, to: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any City</option>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
                  <FiCalendar className="inline mr-1 text-blue-600" />Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
                  <FiSearch /> Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {searched && form.from && form.to
                ? `${form.from} → ${form.to}`
                : 'All Available Flights'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">{flights.length} flight{flights.length !== 1 ? 's' : ''} found</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FiFilter className="text-gray-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="price">Sort: Price</option>
              <option value="seats">Sort: Seats</option>
            </select>
          </div>
        </div>

        {loading ? (
          <Spinner text="Searching flights..." />
        ) : sorted.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">✈️</div>
            <h3 className="text-xl font-semibold text-gray-700">No flights found</h3>
            <p className="text-gray-400 mt-2">Try different dates or cities</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sorted.map(f => <FlightCard key={f.id} flight={f} />)}
          </div>
        )}
      </div>
    </div>
  );
}
