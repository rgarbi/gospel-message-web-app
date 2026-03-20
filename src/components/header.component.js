import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearToken } from '../store/auth/token';
import { useNavigate, Link } from 'react-router-dom';
import { isAdminToken } from '../util/authRouter';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const token = useSelector(state => state.authReducer.token);
  const showAdmin = isAdminToken(token);

  const logOut = () => {
    dispatch(clearToken({}));
    navigate('/');
  };

  return (
    <nav className="px-4 pt-4 pb-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 py-4">
          <a href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="The Gospel Message Logo"
              className="max-h-14 w-auto"
            />
          </a>
          <div className="hidden lg:flex items-center gap-6">
            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Home
            </a>
            {showAdmin && (
              <Link to="/admin" className="text-gray-700 hover:text-blue-600 font-medium">
                Admin
              </Link>
            )}
            <button
              type="button"
              onClick={logOut}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Log Out
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <a href="/" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
              Home
            </a>
            {showAdmin && (
              <Link to="/admin" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
                Admin
              </Link>
            )}
            <button
              type="button"
              onClick={logOut}
              className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 font-medium"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
