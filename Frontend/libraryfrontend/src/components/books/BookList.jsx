import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../../redux/slices/bookSlice';

const BookList = () => {
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  if (loading) return <p className="text-center mt-10">Loading books...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">Error: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">📚 Available Books</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book.id} className="border rounded-lg p-4 shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-gray-800">{book.title}</h3>
            <p className="text-sm text-gray-600 mt-1">Author: {book.author}</p>
            <p className="text-sm text-gray-600">Category: {book.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
