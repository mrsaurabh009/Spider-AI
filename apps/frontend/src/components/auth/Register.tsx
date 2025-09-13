import React from 'react';
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Create Account
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Register page coming soon...
      </p>
      <Link
        to="/auth/login"
        className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
      >
        Back to Login
      </Link>
    </div>
  );
};

export default Register;
