import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBorrowRecord } from "../../redux/slices/borrowSlice";
import apiClient from "../../api/apiClient";
import { toast } from "react-toastify";

const BorrowForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.borrows);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    book_id: "", // ✅ Changed from 'book' to 'book_id'
    due_date: "",
  });

  const [books, setBooks] = useState([]);

  // ✅ Fetch only available books
  useEffect(() => {
    const fetchAvailableBooks = async () => {
      try {
        const response = await apiClient.get("/books/");
        const availableBooks = response.filter(
          (book) => book.status === "available"
        );
        setBooks(availableBooks);
      } catch (err) {
        toast.error("Failed to fetch books");
      }
    };
    fetchAvailableBooks();
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(" Borrow request:", formData);

    if (!formData.book_id || !formData.due_date) {
      // ✅ Changed
      toast.error("Please select a book and due date");
      return;
    }

    try {
      await dispatch(createBorrowRecord(formData)).unwrap();
      toast.success("Book borrowed successfully!");
      setFormData({ book_id: "", due_date: "" }); // ✅ Changed
    } catch (err) {
      toast.error(err || "Failed to borrow book");
    }
  };

  //  Restrict to authenticated users only
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
          <p className="text-gray-600 mt-2">Please log in to borrow books.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
           Borrow a Book
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Book Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Book
            </label>
            <select
              name="book_id" // ✅ Changed from 'book' to 'book_id'
              value={formData.book_id} // ✅ Changed
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 p-2"
              required
            >
              <option value="">Select Book</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} — {b.author}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]} // ✅ Prevent past dates
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 p-2"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {loading ? "Borrowing..." : "Borrow Book"}
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-center text-sm mt-4">{error}</p>
        )}
      </div>
    </div>
  );
};

export default BorrowForm;
