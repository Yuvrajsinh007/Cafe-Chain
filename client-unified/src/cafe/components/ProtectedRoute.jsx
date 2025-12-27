import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import Loader from './Loader';

function ProtectedRoute({ children, requireActiveCafe = false }) {
  const { state } = useAppContext();
  const { isAuthenticated, user, isLoading } = state;
  const location = useLocation();

  // 1. Show a loader while the app initializes the session from storage.
  if (isLoading) {
    return <Loader />;
  }

  // 2. If not authenticated, always redirect to the login page.
  if (!isAuthenticated) {
    return <Navigate to="/cafe/auth/login" state={{ from: location }} replace />;
  }

  // At this point, the user is authenticated.
  // Now, check if this route requires an 'active' status.
  if (requireActiveCafe) {
    // ✅ FIXED: Correctly checks the status from the nested user object.
    if (user?.status !== 'active') {
        // If status is anything other than 'active', send to the pending page.
        return <Navigate to="/cafe/pending-approval" replace />;
    }
  }

  // 4. If a logged-in user tries to go back to the login/register pages,
  // redirect them to their appropriate page.
  if (location.pathname === '/cafe/auth/login' || location.pathname === '/cafe/auth/register') {
      if (user?.status === 'active') {
          return <Navigate to="/cafe/dashboard" replace />;
      }
      return <Navigate to="/cafe/pending-approval" replace />;
  }

  // 5. If all checks pass, render the requested component.
  return children;
}

export default ProtectedRoute;