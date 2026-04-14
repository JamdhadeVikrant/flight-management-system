import { MdFlight, MdAirlineSeatReclineNormal } from 'react-icons/md';
import { FiClock, FiCalendar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function FlightCard({ flight, showBook = true }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 card-hover">
      {/* Airline Header */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <MdFlight className="text-blue-300 rotate-45" size={20} />
          <span className="font-semibold text-sm">{flight.airline}</span>
          <span className="text-blue-300 text-xs bg-blue-800 px-2 py-0.5 rounded-full">{flight.flightNumber}</span>
        </div>
        <span className="text-white font-bold text-lg">₹{Number(flight.price).toLocaleString('en-IN')}</span>
      </div>

      {/* Route */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{flight.from}</p>
            <p className="text-xs text-gray-500 mt-1">Departure</p>
            <p className="text-sm font-medium text-blue-600 mt-1">{flight.departureTime || '—'}</p>
          </div>
          <div className="flex-1 mx-4 flex flex-col items-center">
            <div className="flex items-center w-full">
              <div className="h-px flex-1 bg-gray-300" />
              <MdFlight className="text-blue-500 rotate-90 mx-2" size={22} />
              <div className="h-px flex-1 bg-gray-300" />
            </div>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <FiClock size={11} /> {flight.duration || 'Non-stop'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{flight.to}</p>
            <p className="text-xs text-gray-500 mt-1">Arrival</p>
            <p className="text-sm font-medium text-blue-600 mt-1">{flight.arrivalTime || '—'}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <FiCalendar size={13} /> {flight.date}
          </span>
          <span className="flex items-center gap-1">
            <MdAirlineSeatReclineNormal size={14} />
            <span className={flight.availableSeats < 10 ? 'text-red-500 font-medium' : 'text-green-600 font-medium'}>
              {flight.availableSeats} seats left
            </span>
          </span>
          {showBook && (
            <button
              onClick={() => navigate(`/book/${flight.id}`)}
              disabled={flight.availableSeats === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-1.5 rounded-full text-xs font-semibold transition-colors"
            >
              {flight.availableSeats === 0 ? 'Full' : 'Book Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
