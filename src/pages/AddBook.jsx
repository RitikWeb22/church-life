// src/pages/AddBook.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AddBook = () => {
  const navigate = useNavigate();
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
  });
  // State for the file upload and preview
  const [coverFile, setCoverFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Update the text fields in the state
  const handleChange = (e) => {
    setBookData({ ...bookData, [e.target.name]: e.target.value });
  };

  // Handle file selection for cover image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setPreview(URL.createObjectURL(file)); // Create a preview URL
    }
  };

  // Handle form submission to add a new book with a file upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append('title', bookData.title);
      formData.append('author', bookData.author);
      formData.append('description', bookData.description);
      formData.append('price', parseFloat(bookData.price));
      if (coverFile) {
        formData.append('coverImage', coverFile);
      }
      // The backend should be set up to handle multipart/form-data
      await api.post('/books', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setLoading(false);
      // After successful creation, navigate to the book list page
      navigate('/books');
    } catch (err) {
      setError(err.response?.data.message || 'Failed to add book');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto bg-base-200 p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Add New Book</h2>
        {error && <div className="alert alert-error mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
            placeholder='Title'
              type="text"
              name="title"
              value={bookData.title}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          {/* Author */}
          <div>
            <label className="label">
              <span className="label-text">Author</span>
            </label>
            <input
            placeholder='Author'
              type="text"
              name="author"
              value={bookData.author}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          {/* Description */}
          <div>
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
            placeholder='Description'
              name="description"
              value={bookData.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              required
            ></textarea>
          </div>
          {/* Price */}
          <div>
            <label className="label">
              <span className="label-text">Price</span>
            </label>
            <input
          placeholder='Price'
              type="number"
              name="price"
              value={bookData.price}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          {/* Cover Image File Upload */}
          <div>
            <label className="label">
              <span className="label-text">Cover Image</span>
            </label>
            <input
  type="file"
  name="coverImage"
  accept="image/*"
  onChange={handleFileChange}
  className="file-input file-input-bordered w-full"
  required
/>
{preview && (
  <div className="mt-2">
    <img
      src={preview}
      alt="Cover Preview"
      className="w-32 h-32 object-cover rounded"
    />
  </div>
)}
          </div>
          {/* Submit Button */}
          <div className="flex justify-center">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
