// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Link } from 'react-router-dom';

// Register the chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [books, setBooks] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal states for book edit and delete confirmation
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBookData, setEditBookData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState(null);

  // Fetch data from the backend on mount and after actions
  const fetchData = async () => {
    try {
      setLoading(true);
      const booksRes = await api.get('/books');
      const borrowRes = await api.get('/borrow');
      const usersRes = await api.get('/users');
      setBooks(booksRes.data);
      setBorrowRecords(borrowRes.data);
      setUsers(usersRes.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data.message || 'Failed to load data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Open edit modal with selected book data
  const openEditModal = (book) => {
    setEditBookData({ ...book });
    setShowEditModal(true);
  };

  // Handle updating the book (from the edit modal)
  const handleUpdateBook = async () => {
    try {
      const formData = new FormData();
      formData.append('title', editBookData.title);
      formData.append('author', editBookData.author);
      formData.append('description', editBookData.description);
      formData.append('price', parseFloat(editBookData.price));
      if (editBookData.coverImageFile) {
        formData.append('coverImage', editBookData.coverImageFile);
      }
      await api.put(`/books/${editBookData._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setShowEditModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data.message || 'Failed to update book');
    }
  };

  // Open delete modal for confirmation
  const openDeleteModal = (bookId) => {
    setDeleteBookId(bookId);
    setShowDeleteModal(true);
  };

  // Handle book deletion
  const handleDeleteBook = async () => {
    try {
      await api.delete(`/books/${deleteBookId}`);
      setShowDeleteModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data.message || 'Failed to delete book');
    }
  };

  // Handle marking a borrow record as returned
  const handleMarkReturned = async (recordId) => {
    try {
      await api.put(`/borrow/${recordId}`, { returned: true });
      fetchData();
    } catch (err) {
      alert(err.response?.data.message || 'Failed to update record');
    }
  };

  // --- Dashboard Summary with Chart ---
  const renderDashboard = () => {
    const chartData = {
      labels: ['Books', 'Borrow Records', 'Users'],
      datasets: [
        {
          label: 'Count',
          data: [books.length, borrowRecords.length, users.length],
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Admin Dashboard Overview' },
      },
    };

    return (
      <div className="p-4">
        <div className="mb-6">
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-md">
            <div className="card-body text-center">
              <h3 className="card-title">Total Books</h3>
              <p className="text-4xl font-bold">{books.length}</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-md">
            <div className="card-body text-center">
              <h3 className="card-title">Borrow Records</h3>
              <p className="text-4xl font-bold">{borrowRecords.length}</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-md">
            <div className="card-body text-center">
              <h3 className="card-title">Total Users</h3>
              <p className="text-4xl font-bold">{users.length}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- Books Management ---
  const renderBooksManagement = () => (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Books Management</h2>
        <Link to="/admin/add-book">
          <button className="btn btn-primary">Add New Book</button>
        </Link>
      </div>
      {books.length === 0 ? (
        <p>No books available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Price</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>₹{book.price.toFixed(2)}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline mr-2"
                      onClick={() => openEditModal(book)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => openDeleteModal(book._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Edit Book Modal */}
      {showEditModal && editBookData && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg">
            <h3 className="font-bold text-lg mb-4">Edit Book</h3>
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={editBookData.title}
                  onChange={(e) =>
                    setEditBookData({ ...editBookData, title: e.target.value })
                  }
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Author</span>
                </label>
                <input
                  type="text"
                  name="author"
                  value={editBookData.author}
                  onChange={(e) =>
                    setEditBookData({ ...editBookData, author: e.target.value })
                  }
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  name="description"
                  value={editBookData.description}
                  onChange={(e) =>
                    setEditBookData({ ...editBookData, description: e.target.value })
                  }
                  className="textarea textarea-bordered w-full"
                ></textarea>
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Price</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={editBookData.price}
                  onChange={(e) =>
                    setEditBookData({ ...editBookData, price: e.target.value })
                  }
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Cover Image</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setEditBookData({
                        ...editBookData,
                        coverImageFile: e.target.files[0],
                      });
                    }
                  }}
                  className="file-input file-input-bordered w-full"
                />
                {editBookData.coverImage && (
                  <div className="mt-2">
                    <img
                      src={editBookData.coverImage}
                      alt="Cover Preview"
                      className="w-32 h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="modal-action">
              <button className="btn btn-primary" onClick={handleUpdateBook}>
                Save
              </button>
              <button className="btn" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-sm">
            <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this book?</p>
            <div className="modal-action">
              <button className="btn btn-error" onClick={handleDeleteBook}>
                Delete
              </button>
              <button className="btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // --- Borrow Records Management ---
  const renderBorrowManagement = () => (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Borrow Records</h2>
      {borrowRecords.length === 0 ? (
        <p>No borrow records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>User</th>
                <th>Book</th>
                <th>Borrowed At</th>
                <th>Due Date</th>
                <th>Returned</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {borrowRecords.map((record) => (
                <tr key={record._id}>
                  <td>{record.user ? record.user.name : 'N/A'}</td>
                  <td>{record.book ? record.book.title : 'N/A'}</td>
                  <td>{new Date(record.borrowedAt).toLocaleString()}</td>
                  <td>
                    {record.dueDate
                      ? new Date(record.dueDate).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td>{record.returned ? 'Yes' : 'No'}</td>
                  <td className="text-center">
                    {!record.returned && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleMarkReturned(record._id)}
                      >
                        Mark as Returned
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // --- User Management ---
  const renderUserManagement = () => (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Admin</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                  <td className="text-center">
                    {!user.isAdmin ? (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={async () => {
                          try {
                            await api.put(`/users/${user._id}`, { isAdmin: true });
                            const res = await api.get('/users');
                            setUsers(res.data);
                          } catch (err) {
                            alert(err.response?.data.message || 'Failed to update user');
                          }
                        }}
                      >
                        Make Admin
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={async () => {
                          try {
                            await api.put(`/users/${user._id}`, { isAdmin: false });
                            const res = await api.get('/users');
                            setUsers(res.data);
                          } catch (err) {
                            alert(err.response?.data.message || 'Failed to update user');
                          }
                        }}
                      >
                        Revoke Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Render content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'books':
        return renderBooksManagement();
      case 'borrow':
        return renderBorrowManagement();
      case 'users':
        return renderUserManagement();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="w-full lg:w-64 bg-base-200 p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Menu</h2>
        <ul>
          <li
            className={`mb-4 cursor-pointer ${activeTab === 'dashboard' ? 'text-primary font-bold' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </li>
          <li
            className={`mb-4 cursor-pointer ${activeTab === 'books' ? 'text-primary font-bold' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            Books Management
          </li>
          <li
            className={`mb-4 cursor-pointer ${activeTab === 'borrow' ? 'text-primary font-bold' : ''}`}
            onClick={() => setActiveTab('borrow')}
          >
            Borrow Records
          </li>
          <li
            className={`mb-4 cursor-pointer ${activeTab === 'users' ? 'text-primary font-bold' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </li>
        </ul>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-4xl font-bold mb-6 text-center">Admin Dashboard</h1>
        {loading ? (
          <div className="text-center">Loading data...</div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
