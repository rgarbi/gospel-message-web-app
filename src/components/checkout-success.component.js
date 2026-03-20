import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import getServerAddress from '../util/serverLocation';
import { checkoutSuccess } from '../api/client';

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();

  const state = useSelector(state => state.authReducer);
  const navigate = useNavigate();

  React.useEffect(() => {
    const validateSession = async () => {
      const sessionIdFromParam = searchParams.get('session_id');
      const address = getServerAddress();

      if (!sessionIdFromParam) {
        navigate('/');
      } else {
        const response = await checkoutSuccess(
          address,
          state.token.token,
          state.token.user_id,
          sessionIdFromParam
        );
        if (response.statusCode < 300) {
          navigate('/subscriber');
        }
      }
    };
    validateSession();
  }, [navigate, searchParams, state.token.token, state.token.user_id]);

  return (
    <div className="max-w-7xl mx-auto p-8 w-full flex flex-col items-center justify-center min-h-[200px]">
      <svg
        className="animate-spin h-12 w-12 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  );
}
