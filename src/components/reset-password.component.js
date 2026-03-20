import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import getServerAddress from '../util/serverLocation';
import { exchangeOtpForToken, forgotPasswordResetPassword } from '../api/client';
import { clearToken } from '../store/auth/token';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchParams] = useSearchParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    const validateOTP = async () => {
      const address = getServerAddress();
      const otp = searchParams.get('otp');

      if (!otp) {
        navigate('/');
      } else {
        const response = await exchangeOtpForToken(address, otp);

        if (response.statusCode > 300) {
          setErrorMessage('Something went wrong.');
        }

        if (response.statusCode < 300) {
          const token = response.object;
          setTempToken(token.token);
          setUserId(token.user_id);
        }
      }
    };
    validateOTP();
  }, [navigate, searchParams]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const address = getServerAddress();
    const response = await forgotPasswordResetPassword(address, tempToken, userId, password);

    if (response.statusCode < 300) {
      dispatch(clearToken());
      navigate('/');
    }

    if (response.statusCode > 399) {
      setErrorMessage('Something happened!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 w-full">
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reset-password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="reset-password"
              type="password"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter password"
              onChange={evt => setPassword(evt.target.value)}
              value={password}
            />
          </div>
          {errorMessage && <div className="text-red-600 text-sm">{errorMessage}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
