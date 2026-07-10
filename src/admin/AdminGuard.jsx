import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/StoreContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminGuard({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.is_staff) return <Navigate to="/" replace />;

  return children;
}
