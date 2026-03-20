import React, { useState } from 'react';
import getServerAddress from '../util/serverLocation';
import { forgotPassword } from '../api/client';

export default function ForgotPassword() {
  const [emailAddress, addEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (emailAddress.length > 0) {
      const address = getServerAddress();
      const response = await forgotPassword(address, emailAddress);
      const msg = 'If a user with that email exists we have sent them instructions for resetting their password.';

      if (response.statusCode < 300) {
        setMessage(msg);
        addEmail('');
      }

      if (response.statusCode > 399) {
        setMessage(msg);
        addEmail('');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 w-full">
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h4 className="text-xl font-semibold">Forgot Password</h4>
          <p className="text-gray-600">Enter the email address for your account.</p>
          <div>
            <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="forgot-email"
              type="email"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter email"
              onChange={evt => addEmail(evt.target.value)}
              value={emailAddress}
            />
          </div>
          {message && <div className="text-gray-600 text-sm">{message}</div>}
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
