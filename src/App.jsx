// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookList from './components/BookList';
import BookDetail from './components/BookDetails';
import BorrowManagement from './pages/BorrowManagement'; // new admin page
import AdminDashboard from './pages/AdminDashboard';
import AddBook from './pages/AddBook';

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/books" element={<BookList />} />
      <Route path="/books/:id" element={<BookDetail />} />
      {/* <Route path="/meetings" element={<MeetingManagement />} /> */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/add-book" element={<AddBook />} />

      {/* Admin route for borrow management */}
      <Route path="/admin/borrow-management" element={<BorrowManagement />} />
    </Routes>
  </Router>
);

export default App;
