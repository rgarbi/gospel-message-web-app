import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import getServerAddress from '../util/serverLocation';
import { logIn, checkToken } from '../api/client';
import { addToken, clearToken } from '../store/auth/token';
import { isTokenEmpty, tokenIsExpired, validateCheckTokenResponseIs401 } from '../util/authRouter';

export default function LogIn() {
  const [emailAddress, addEmail] = useState('');
  const [password, addPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const state = useSelector(state => state.authReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    const checkForAGoodToken = async () => {
      if (isTokenEmpty(state.token)) {
        // DO NOTHING
      } else {
        const checkTokenResponse = await checkToken(getServerAddress(), state.token.token, state.token.user_id);
        if (tokenIsExpired(state.token) || validateCheckTokenResponseIs401(checkTokenResponse)) {
          dispatch(clearToken({}));
        } else {
          navigate('/subscriber');
        }
      }
    };
    checkForAGoodToken();
  }, [state.token, dispatch, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const address = getServerAddress();
    const response = await logIn(address, emailAddress, password);

    if (response.statusCode < 300) {
      const token = response.object;
      dispatch(addToken(token));
      navigate('/subscriber');
    }

    if (response.statusCode > 399) {
      setErrorMessage('Incorrect Email Address or Password.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-1">Log In</h2>
      <p className="text-sm text-gray-600 text-center mb-4">Please log in to manage your subscription.</p>
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          placeholder="Enter email"
          onChange={evt => addEmail(evt.target.value)}
          value={emailAddress}
        />
      </div>
      <div className="mt-4">
        <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          placeholder="Enter password"
          onChange={evt => addPassword(evt.target.value)}
          value={password}
        />
      </div>
      {errorMessage && <div className="mt-2 text-sm text-red-600">{errorMessage}</div>}
      <button
        type="submit"
        className="w-full mt-6 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
      >
        Submit
      </button>
      <p className="mt-4 text-right text-sm text-gray-600">
        Forgot <a href="/forgot-password" className="text-blue-600 hover:underline">password?</a>
      </p>
    </form>
  );
}
