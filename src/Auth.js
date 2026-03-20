import React, { useState } from 'react';
import LogIn from './components/login.component';
import SignUp from './components/signup.component';

export default function Auth() {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="flex items-start justify-center min-h-[calc(100vh-4rem)] bg-gray-100 px-4 pt-6 pb-8">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
        <div className="flex border-b border-gray-200 mb-6 -mx-6 -mt-6 px-6 pt-6">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 text-center font-medium text-sm transition-colors ${
              activeTab === 'login'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2 text-center font-medium text-sm transition-colors ${
              activeTab === 'signup'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
            }`}
          >
            Sign Up
          </button>
        </div>
        {activeTab === 'login' && <LogIn />}
        {activeTab === 'signup' && <SignUp />}
      </div>
    </div>
  );
}
