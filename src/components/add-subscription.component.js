import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import getServerAddress from '../util/serverLocation';
import { getSubscriber, initiateCheckout } from '../api/client';

export default function NewSubscription() {
  const SUBMIT_BUTTON_TEXT = 'Submit';

  const [subscriberId, setSubscriberId] = useState('');
  const [buttonText, setButtonText] = useState(SUBMIT_BUTTON_TEXT);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [name, setName] = useState('');
  const [mailingAddressLine1, setMailingAddressLine1] = useState('');
  const [mailingAddressLine2, setMailingAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [subscriptionType, setSubscriptionType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const state = useSelector(state => state.authReducer);

  React.useEffect(() => {
    const fetchSubscriber = async () => {
      const address = getServerAddress();
      const response = await getSubscriber(address, state.token.user_id, state.token.token);

      if (response.statusCode < 300) {
        const subscriber = response.object;
        setSubscriberId(subscriber.id);
      }
    };
    fetchSubscriber();
  }, [state.token.user_id, state.token.token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setButtonDisabled(true);
    setButtonText('');
    setShowSpinner(true);

    const address = getServerAddress();
    const response = await initiateCheckout(
      address,
      state.token.token,
      state.token.user_id,
      subscriberId,
      name,
      mailingAddressLine1,
      mailingAddressLine2,
      city,
      province,
      postalCode,
      emailAddress,
      subscriptionType,
      'gmdigitalsub-test'
    );

    if (response.statusCode < 300) {
      window.location.href = response.object.location;
    }

    if (response.statusCode > 399) {
      setErrorMessage('Missing required field.');
      setButtonText(SUBMIT_BUTTON_TEXT);
      setButtonDisabled(false);
      setShowSpinner(false);
    }
  };

  const inputClasses = 'block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500';
  const labelClasses = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="max-w-7xl mx-auto p-4 w-full">
      <div className="bg-white rounded-lg shadow-lg p-6 text-left">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClasses}>Name</label>
            <input
              type="text"
              className={inputClasses}
              placeholder="John Smith"
              onChange={evt => setName(evt.target.value)}
              value={name}
              required
            />
          </div>
          <div>
            <label className={labelClasses}>Mailing Address Line 1</label>
            <input
              type="text"
              className={inputClasses}
              placeholder="123 Main"
              onChange={evt => setMailingAddressLine1(evt.target.value)}
              value={mailingAddressLine1}
              required
            />
          </div>
          <div>
            <label className={labelClasses}>Mailing Address Line 2</label>
            <input
              type="text"
              className={inputClasses}
              placeholder="Suite 200"
              onChange={evt => setMailingAddressLine2(evt.target.value)}
              value={mailingAddressLine2}
            />
          </div>
          <div>
            <label className={labelClasses}>City</label>
            <input
              type="text"
              className={inputClasses}
              placeholder="City"
              onChange={evt => setCity(evt.target.value)}
              value={city}
              required
            />
          </div>
          <div>
            <label className={labelClasses}>State</label>
            <input
              type="text"
              className={inputClasses}
              placeholder="State"
              onChange={evt => setProvince(evt.target.value)}
              value={province}
              required
            />
          </div>
          <div>
            <label className={labelClasses}>Postal Code</label>
            <input
              type="text"
              className={inputClasses}
              placeholder="12345"
              onChange={evt => setPostalCode(evt.target.value)}
              value={postalCode}
              required
            />
          </div>
          <div>
            <label className={labelClasses}>Email Address</label>
            <input
              type="email"
              className={inputClasses}
              placeholder="Email Address"
              onChange={evt => setEmailAddress(evt.target.value)}
              value={emailAddress}
              required
            />
          </div>
          <div>
            <label className={labelClasses}>Subscription Type</label>
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="subscriptionType"
                  value="Digital"
                  onChange={() => setSubscriptionType('Digital')}
                  className="text-blue-600"
                />
                Digital
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="subscriptionType"
                  value="Paper"
                  onChange={() => setSubscriptionType('Paper')}
                  className="text-blue-600"
                />
                Paper
              </label>
            </div>
          </div>
          {errorMessage && <div className="text-red-600 text-sm">{errorMessage}</div>}
          <button
            type="submit"
            disabled={buttonDisabled}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md"
          >
            {buttonText}
            {showSpinner && (
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            <span className="sr-only">Submitting...</span>
          </button>
        </form>
      </div>
    </div>
  );
}
