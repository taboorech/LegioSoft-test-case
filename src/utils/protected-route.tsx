import { Navigate } from 'react-router-dom';

/**
 * A component that protects routes by checking for a token in localStorage.
 * If token is present, renders its children; otherwise, redirects to login page.
 * @param children The children elements to render if authenticated
 * @returns A Navigate component to redirect or render children
 */
const ProtectedRoute = ({ children }: any) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  // If token is not present, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Render the children if authenticated
  return children;
};

export default ProtectedRoute;
