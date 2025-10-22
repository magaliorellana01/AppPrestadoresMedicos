import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const prestador = localStorage.getItem('prestador');
  const token = localStorage.getItem('token');

  if (!prestador || !token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 