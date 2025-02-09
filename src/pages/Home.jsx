// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div
        className="hero flex-grow"
        style={{ backgroundImage: `url('./bg.png')` }}
      >
        <div className="hero-overlay bg-opacity-40"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">
              Welcome to Church Library
            </h1>
            <p className="mb-5 text-lg">
              Explore our collection of church-related books and resources. Find your next inspirational read!
            </p>
            <Link to="/books" className="btn btn-primary">
              Browse Books
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-base-200 text-center py-4">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} Church Library. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Home;
