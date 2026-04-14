import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { MdFlight } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { currentUser, userRole, userStatus, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-[#1e3a5f] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <MdFlight className="text-blue-400 text-2xl rotate-45" />
            <span className="text-white">SkyWings</span>
            <span className="text-blue-400 text-sm font-normal hidden sm:block">Airlines</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-blue-300 transition-colors">Home</Link>
            <Link to="/flights" className="hover:text-blue-300 transition-colors">Flights</Link>
            {currentUser && userRole === 'admin' && userStatus === 'approved' && (
              <Link to="/admin" className="hover:text-blue-300 transition-colors">Admin</Link>
            )}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-full transition-colors"
                >
                  <FiUser />
                  <span>{currentUser.displayName?.split(' ')[0] || 'Account'}</span>
                </button>
                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-xl overflow-hidden z-50">
                    <Link
                      to="/dashboard"
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-sm"
                    >
                      <FiSettings className="text-blue-600" /> My Dashboard
                    </Link>
                    <button
                      onClick={() => { setDropOpen(false); handleLogout(); }}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-sm w-full text-left text-red-600"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="hover:text-blue-300 transition-colors">Login</Link>
                <Link to="/signup" className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-full transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#162d4a] px-4 pb-4 space-y-2 text-sm">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-blue-300">Home</Link>
          <Link to="/flights" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-blue-300">Flights</Link>
          {currentUser && userRole === 'admin' && userStatus === 'approved' && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-blue-300">Admin</Link>
          )}
          {currentUser ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-blue-300">Dashboard</Link>
              <button onClick={handleLogout} className="block py-2 text-red-400 w-full text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-blue-300">Login</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-blue-300">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
