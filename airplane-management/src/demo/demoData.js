// Seed demo flights
export const DEMO_FLIGHTS = [
  {
    id: 'f1', flightNumber: 'SW-101', airline: 'SkyWings Air',
    from: 'Mumbai', to: 'Delhi', date: '2026-04-20',
    departureTime: '06:00', arrivalTime: '08:15', duration: '2h 15m',
    price: 3499, totalSeats: 180, availableSeats: 42,
  },
  {
    id: 'f2', flightNumber: 'SW-202', airline: 'SkyWings Air',
    from: 'Delhi', to: 'Bangalore', date: '2026-04-20',
    departureTime: '09:30', arrivalTime: '12:00', duration: '2h 30m',
    price: 4199, totalSeats: 160, availableSeats: 18,
  },
  {
    id: 'f3', flightNumber: 'SW-303', airline: 'SkyWings Air',
    from: 'Mumbai', to: 'Goa', date: '2026-04-21',
    departureTime: '07:45', arrivalTime: '09:00', duration: '1h 15m',
    price: 2299, totalSeats: 120, availableSeats: 75,
  },
  {
    id: 'f4', flightNumber: 'SW-404', airline: 'SkyWings Air',
    from: 'Bangalore', to: 'Chennai', date: '2026-04-21',
    departureTime: '11:00', arrivalTime: '12:10', duration: '1h 10m',
    price: 1899, totalSeats: 140, availableSeats: 90,
  },
  {
    id: 'f5', flightNumber: 'SW-505', airline: 'SkyWings Air',
    from: 'Kolkata', to: 'Hyderabad', date: '2026-04-22',
    departureTime: '14:00', arrivalTime: '16:30', duration: '2h 30m',
    price: 3799, totalSeats: 180, availableSeats: 5,
  },
  {
    id: 'f6', flightNumber: 'SW-606', airline: 'SkyWings Air',
    from: 'Chennai', to: 'Mumbai', date: '2026-04-22',
    departureTime: '16:45', arrivalTime: '19:00', duration: '2h 15m',
    price: 3299, totalSeats: 160, availableSeats: 60,
  },
  {
    id: 'f7', flightNumber: 'SW-707', airline: 'SkyWings Air',
    from: 'Delhi', to: 'Jaipur', date: '2026-04-23',
    departureTime: '08:00', arrivalTime: '09:10', duration: '1h 10m',
    price: 1599, totalSeats: 100, availableSeats: 33,
  },
  {
    id: 'f8', flightNumber: 'SW-808', airline: 'SkyWings Air',
    from: 'Pune', to: 'Hyderabad', date: '2026-04-23',
    departureTime: '10:30', arrivalTime: '12:00', duration: '1h 30m',
    price: 2099, totalSeats: 120, availableSeats: 48,
  },
];

function getStore(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function setStore(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

// Initialize flights if not present
if (!localStorage.getItem('demo_flights')) {
  setStore('demo_flights', DEMO_FLIGHTS);
}
if (!localStorage.getItem('demo_users')) {
  setStore('demo_users', [
    { uid: 'admin1', name: 'Admin User', email: 'admin@skywings.com', password: 'admin123', role: 'admin' },
    { uid: 'user1', name: 'Demo User', email: 'user@skywings.com', password: 'user123', role: 'user' },
  ]);
}
if (!localStorage.getItem('demo_bookings')) {
  setStore('demo_bookings', []);
}

export const demoStore = {
  getFlights: () => getStore('demo_flights', DEMO_FLIGHTS),
  setFlights: (v) => setStore('demo_flights', v),
  getUsers: () => getStore('demo_users', []),
  setUsers: (v) => setStore('demo_users', v),
  getBookings: () => getStore('demo_bookings', []),
  setBookings: (v) => setStore('demo_bookings', v),
  getCurrentUser: () => getStore('demo_current_user', null),
  setCurrentUser: (v) => setStore('demo_current_user', v),
};
