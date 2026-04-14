import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
}

export function AdminRoute({ children }) {
  const { currentUser, userRole, userStatus } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (userRole !== 'admin') return <Navigate to="/dashboard" replace />;
  if (userStatus === 'pending') return <Navigate to="/pending-approval" replace />;
  return children;
}
