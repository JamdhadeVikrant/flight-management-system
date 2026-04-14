import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { MdFlight, MdHourglassEmpty } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function PendingApproval() {
  const { currentUser, logout, refreshUserData } = useAuth();
  const navigate = useNavigate();

  // Real-time listener — redirect as soon as admin approves
  useEffect(() => {
    if (!currentUser) return;
    const unsub = onSnapshot(doc(db, 'users', currentUser.uid), async (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      if (data.role === 'admin' && data.status === 'approved') {
        await refreshUserData();
        toast.success('Your admin access has been approved!');
        navigate('/admin');
      } else if (data.role === 'user') {
        await refreshUserData();
        toast.error('Your admin request was rejected. You have been assigned as a regular user.');
        navigate('/dashboard');
      }
    });
    return () => unsub();
  }, [currentUser]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <MdFlight className="text-blue-600 text-3xl rotate-45" />
          <span className="text-2xl font-bold text-gray-800">SkyWings</span>
        </div>

        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <MdHourglassEmpty className="text-yellow-500 text-4xl animate-pulse" />
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2">Approval Pending</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-2">
          Your admin account request has been submitted.
        </p>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          An existing admin needs to approve your access. This page will automatically redirect once approved.
        </p>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700 mb-6">
          <p className="font-semibold mb-1">Registered as:</p>
          <p>{currentUser?.displayName}</p>
          <p className="text-blue-500">{currentUser?.email}</p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-6">
          <span className="h-2 w-2 bg-yellow-400 rounded-full animate-ping" />
          Waiting for admin approval...
        </div>

        <button
          onClick={handleLogout}
          className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
