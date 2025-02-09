// src/components/BookDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [borrowMessage, setBorrowMessage] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/books/${id}`);
        setBook(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data.message || 'Failed to fetch book details');
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleBorrow = async () => {
    try {
      setBorrowMessage('');
      // Set dueDate to 7 days from now
      const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await api.post('/borrow', { bookId: book._id, dueDate });
      setBorrowMessage('Book borrowed successfully!');
    } catch (err) {
      setBorrowMessage(err.response?.data.message || 'Failed to borrow book');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-center text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link to="/books" className="btn btn-ghost mb-4">
        &larr; Back to Books
      </Link>
      <div className="card lg:card-side bg-base-100 shadow-md rounded-lg overflow-hidden">
        <figure className="lg:w-1/2">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-64 object-cover"
          />
        </figure>
        <div className="card-body p-6">
          <h2 className="card-title text-2xl font-bold">{book.title}</h2>
          <p className="text-base text-gray-600 mb-2">by {book.author}</p>
          <div className="divider my-3"></div>
          <p className="text-sm text-gray-700 mb-4">{book.description}</p>
          <div className="text-xl font-bold text-primary mb-4">
          ₹{book.price.toFixed(2)}
          </div>
          {borrowMessage && (
            <div
              className={`alert ${
                borrowMessage.includes('successfully')
                  ? 'alert-success'
                  : 'alert-error'
              } mb-4`}
            >
              {borrowMessage}
            </div>
          )}
          <div className="card-actions">
            <button className="btn btn-primary" onClick={handleBorrow}>
              Borrow Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
