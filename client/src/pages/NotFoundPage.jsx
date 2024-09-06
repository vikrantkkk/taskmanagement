import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-6">Oops! The page you are looking for does not exist.</p>
        <Link to="/" className="text-blue-500 hover:underline">Go back to Home</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
