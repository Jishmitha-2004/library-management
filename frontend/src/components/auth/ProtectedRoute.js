import React from 'react';
 import { Navigate } from 'react-router-dom';
 import { useAuth } from '../../context/AuthContext';
 import LoadingSpinner from '../common/LoadingSpinner';
 const ProtectedRoute = ({ children, adminOnly = false }) => {
 const { user, loading, isAuthenticated, isAdmin } = useAuth();
 if (loading) {
 return <LoadingSpinner />;
 }
 if (!isAuthenticated) {
 return <Navigate to="/login" />;
 }
 if (adminOnly && !isAdmin) {
 return <Navigate to="/dashboard" />;
 }
 return children;
 };
 export default ProtectedRoute;