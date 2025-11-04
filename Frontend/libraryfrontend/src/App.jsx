import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ToastContainer } from "react-toastify";

// Auth Components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// Layout Components
import Dashboard from "./components/layout/Dashboard";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Private Route
import PrivateRoute from "./components/PrivateRoute";

// Book Components
import BookList from "./components/books/BookList";
import BookForm from "./components/books/BookForm"; // ✅ new import

//Borrow Components
import BorrowForm from "./components/borrowings/BorrowForm";
import BorrowList from "./components/borrowings/BorrowList";
// Placeholder Components

const CategoryList = () => (
  <div className="p-8">Category List - Coming Soon</div>
);
const UserList = () => <div className="p-8">User List - Coming Soon</div>;

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/books"
            element={
              <PrivateRoute>
                <BookList />
              </PrivateRoute>
            }
          />

          {/* ✅ Add route for creating a new book */}
          <Route
            path="/books/new"
            element={
              <PrivateRoute librarianAllowed>
                <BookForm />
              </PrivateRoute>
            }
          />

          <Route
            path="/borrows"
            element={
              <PrivateRoute>
                <BorrowForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-borrows"
            element={
              <PrivateRoute>
                <BorrowList />
              </PrivateRoute>
            }
          />

          <Route
            path="/categories"
            element={
              <PrivateRoute>
                <CategoryList />
              </PrivateRoute>
            }
          />

          {/* Admin Only Route */}
          <Route
            path="/users"
            element={
              <PrivateRoute adminOnly>
                <UserList />
              </PrivateRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Footer />
      </Router>
    </Provider>
  );
}

export default App;
