import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth(); // Getting the authentication status from the AuthContext
  const location = useLocation(); // Getting the current location

  // If the user is authenticated, render the nested routes (Outlet)
  // If the user is not authenticated, redirect to the home page, preserving the current location
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace state={{ from: location }} />
  );
};

export default ProtectedRoute;
