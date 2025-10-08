// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access'); // or wherever you store your JWT

  if (!token) {
    return <Navigate to="/login" replace />;
  }
 try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp < currentTime) {
      console.log('Token is expired, redirecting to login');
      // Clear expired tokens
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('username');
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.log('Invalid token format, redirecting to login');
    // Clear invalid tokens
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    return <Navigate to="/login" replace />;
  }
  
  console.log('Token is valid, rendering protected component');
  return children;
};

export default ProtectedRoute;
