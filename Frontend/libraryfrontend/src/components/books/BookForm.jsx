import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBook, clearBookError } from '../../redux/slices/bookSlice';
import apiClient from '../../api/apiClient';
import { toast } from 'react-toastify';

const BookForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.books);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    ISBN: '',
    status: 'available',
  });

  const [categories, setCategories] = useState([]);

  // ✅ Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/categories/');
        setCategories(response);
      } catch (err) {
        toast.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📤 Submitting book data:", formData);
    if (!formData.title || !formData.author || !formData.ISBN || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await dispatch(createBook(formData)).unwrap();
      toast.success('Book added successfully!');
      setFormData({
        title: '',
        author: '',
        category: '',
        ISBN: '',
        status: 'available',
      });
    } catch (err) {
      toast.error(err || 'Failed to add book');
    }
  };

  // 🧾 Restrict to librarians/admins
  if (!['admin', 'librarian'].includes(user?.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
          <p className="text-gray-600 mt-2">Only librarians and admins can create new books.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add a New Book</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
            <input
              type="text"
              name="ISBN"
              value={formData.ISBN}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
            >
              <option value="available">Available</option>
              <option value="borrowed">Borrowed</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Adding Book...' : 'Add Book'}
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-center text-sm mt-4">{error}</p>
        )}
      </div>
    </div>
  );
};

export default BookForm;
