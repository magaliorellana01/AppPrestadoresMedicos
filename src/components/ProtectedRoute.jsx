import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const prestador = sessionStorage.getItem('prestador');
  const token = sessionStorage.getItem('token');

  if (!prestador || !token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 