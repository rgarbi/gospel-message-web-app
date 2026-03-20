import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import getServerAddress from '../util/serverLocation';
import { signUp } from '../api/client';
import { addToken } from '../store/auth/token';

export default function SignUp() {
  const [name, addName] = useState('');
  const [emailAddress, addEmail] = useState('');
  const [password, addPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const address = getServerAddress();
    const response = await signUp(address, emailAddress, password, name);

    if (response.statusCode < 300) {
      const token = response.object;
      dispatch(addToken(token));
      navigate('/subscriber');
    }

    if (response.statusCode === 409) {
      setErrorMessage('There is already an account with that Email Address.');
    }
  };

  const inputClass = "w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form id="signUpForm" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-1">Sign Up</h2>
      <p className="text-sm text-gray-600 text-center mb-4">Create an account to manage your subscription.</p>
      <div>
        <label htmlFor="signup-name" className={labelClass}>Name</label>
        <input
          id="signup-name"
          type="text"
          className={inputClass}
          placeholder="John Smith"
          onChange={evt => addName(evt.target.value)}
          value={name}
        />
      </div>
      <div className="mt-4">
        <label htmlFor="signup-email" className={labelClass}>Email</label>
        <input
          id="signup-email"
          type="email"
          className={inputClass}
          placeholder="Enter email"
          onChange={evt => addEmail(evt.target.value)}
          value={emailAddress}
        />
      </div>
      <div className="mt-4">
        <label htmlFor="signup-password" className={labelClass}>Password</label>
        <input
          id="signup-password"
          type="password"
          className={inputClass}
          placeholder="Enter password"
          onChange={evt => addPassword(evt.target.value)}
          value={password}
        />
      </div>
      {errorMessage && <div className="mt-2 text-sm text-red-600">{errorMessage}</div>}
      <input
        type="submit"
        value="Sign Up"
        className="w-full mt-6 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
      />
      <p className="mt-4 text-right text-sm text-gray-600">
        Already registered? <a href="/" className="text-blue-600 hover:underline">Sign in</a>
      </p>
    </form>
  );
}
