import React, { useState, useEffect } from 'react';
import api from '../services/api';

const BorrowManagement = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/borrow'); // GET all borrow records (admin-only)
      setRecords(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data.message || 'Failed to fetch borrow records');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const markAsReturned = async (id) => {
    try {
      await api.put(`/borrow/${id}`, { returned: true });
      fetchRecords();
    } catch (err) {
      alert(err.response?.data.message || 'Failed to update record');
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Loading borrow records...</div>;
  if (error) return <div className="container mx-auto px-4 py-8"><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Borrow Management</h1>
      {records.length === 0 ? (
        <div className="text-center text-2xl font-bold">No borrow records found.</div>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => (
                <tr key={record._id}>
                  <td>{record.user ? record.user.name : 'N/A'}</td>
                  <td>{record.book ? record.book.title : 'N/A'}</td>
                  <td>{new Date(record.borrowedAt).toLocaleString()}</td>
                  <td>{record.dueDate ? new Date(record.dueDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{record.returned ? 'Yes' : 'No'}</td>
                  <td>
                    {!record.returned && (
                      <button className="btn btn-sm btn-success" onClick={() => markAsReturned(record._id)}>
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
};

export default BorrowManagement;
