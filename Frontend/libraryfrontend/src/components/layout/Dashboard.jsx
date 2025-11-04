import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, fetchCurrentUser } from "../../redux/slices/authSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [isAuthenticated, user, dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleViewBooks = () => {
    navigate("/books");
  };
  const handleBorrowBooks = () => {
    navigate("/borrows");
  };
  const handleViewBorrowedBooks = () => {
    navigate("/my-borrows");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-blue-600">Dashboard</h2>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">
                Welcome, {user.username}! 👋
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-medium capitalize">{user.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">User ID</p>
                  <p className="font-medium">{user.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium text-green-600">✓ Active</p>
                </div>
              </div>

              {/* 📚 View Book List Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={handleViewBooks}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  📚 View Book List
                </button>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={handleBorrowBooks}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  📚 Borrow Books
                </button>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={handleViewBorrowedBooks}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  📚View Borrowed Books
                </button>
              </div>
            </div>

            {/* ➕ Add New Book Button (Visible only for Admin and Librarian) */}
            {["admin", "librarian"].includes(user.role) && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate("/books/new")}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  ➕ Add New Book
                </button>
              </div>
            )}

            <div className="bg-green-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-2">🎉 Authentication Working!</h4>
              <p className="text-sm text-gray-700 mb-4">
                Your registration and login system is working correctly. Next
                steps:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>Build book management features (CRUD operations)</li>
                <li>Create borrow/return functionality</li>
                <li>Add search and filter capabilities</li>
                <li>Implement notifications for due dates</li>
              </ul>
            </div>

            {/* Quick Stats - Placeholder for now */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white border-2 border-blue-200 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-blue-600">0</p>
                <p className="text-sm text-gray-600">Books Borrowed</p>
              </div>
              <div className="bg-white border-2 border-green-200 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-green-600">0</p>
                <p className="text-sm text-gray-600">Available Books</p>
              </div>
              <div className="bg-white border-2 border-yellow-200 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-yellow-600">0</p>
                <p className="text-sm text-gray-600">Overdue Books</p>
              </div>
            </div>

            {/* Role-based features preview */}
            {user.role === "admin" && (
              <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
                <h4 className="font-semibold mb-2">
                  👑 Admin Features Available
                </h4>
                <p className="text-sm text-gray-700">
                  As an admin, you'll be able to manage books, users, and view
                  all borrow records.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
