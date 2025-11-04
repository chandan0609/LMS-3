import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, adminOnly = false, librarianAllowed = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🔒 Admin-only access
  if (adminOnly && user && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-700">You don't have permission to access this page.</p>
          <p className="text-sm text-gray-500 mt-2">Admin access required.</p>
        </div>
      </div>
    );
  }

  // 🧾 Admin or Librarian access
  if (librarianAllowed && user && !['admin', 'librarian'].includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only Librarians and Admins can access this page.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
