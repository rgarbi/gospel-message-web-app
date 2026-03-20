import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import getServerAddress from '../util/serverLocation';
import { getSubscriber, getSubscriptionsBySubscriberId, manageStripeSubscription, cancelSubscription } from '../api/client';
import DisplaySubscription from './subscription-display.component';

export default function NewSubscriber() {
  const CHANGE_PAYMENT_METHOD_BUTTON_TEXT = 'Change Payment Method';
  const [name, setName] = useState('');
  const [value, setValue] = useState(0);
  const [subscriptions, setSubscriptions] = useState([]);
  const [buttonText, setButtonText] = useState(CHANGE_PAYMENT_METHOD_BUTTON_TEXT);
  const [changePaymentMethodButtonDisabled, setChangePaymentMethodButtonDisabled] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const state = useSelector(state => state.authReducer);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchSubscriber = async () => {
      const address = getServerAddress();
      const response = await getSubscriber(address, state.token.user_id, state.token.token);

      if (response.statusCode < 300) {
        const subscriber = response.object;
        setName(subscriber.name);

        const subscriptionsResponse = await getSubscriptionsBySubscriberId(
          address,
          subscriber.id,
          state.token.token
        );

        if (subscriptionsResponse.statusCode < 300) {
          setSubscriptions(subscriptionsResponse.object);
        }
      }
    };
    fetchSubscriber();
  }, [state.token.user_id, state.token.token, value]);

  const routeToNewSubscription = () => {
    navigate('/new-subscription');
  };

  const manageStripePaymentMethod = async () => {
    setChangePaymentMethodButtonDisabled(true);
    setButtonText(CHANGE_PAYMENT_METHOD_BUTTON_TEXT + '...');
    setShowSpinner(true);

    const address = getServerAddress();
    const response = await manageStripeSubscription(address, state.token.token, state.token.user_id);

    if (response.statusCode < 300) {
      window.location.href = response.object.location;
    }

    if (response.statusCode > 399) {
      setErrorMessage('Missing required field.');
      setButtonText(CHANGE_PAYMENT_METHOD_BUTTON_TEXT);
      setChangePaymentMethodButtonDisabled(false);
      setShowSpinner(false);
    }
  };

  const cancelASubscription = async (subscriptionId) => {
    const address = getServerAddress();
    const response = await cancelSubscription(address, state.token.token, subscriptionId);

    if (response.statusCode < 300) {
      setValue(v => v + 1);
    }
  };

  const spinnerSvg = (
    <svg
      className="animate-spin h-5 w-5 inline"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 w-full">
      <div className="bg-white rounded-lg shadow mb-6 p-6 text-left">
        <h2 className="text-xl font-semibold">Welcome {name}</h2>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-left">Subscriptions to the Gospel Message</h2>
        </div>
        <div className="p-6 space-y-6">
          {subscriptions.map(
            (subscription) =>
              subscription.active && (
                <div
                  key={subscription.id}
                  className="bg-gray-50 rounded-lg p-6 text-left space-y-4"
                >
                  <DisplaySubscription subscription={subscription} />
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                    <button
                      type="button"
                      onClick={manageStripePaymentMethod}
                      disabled={changePaymentMethodButtonDisabled}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md"
                    >
                      {buttonText}
                      {showSpinner && spinnerSvg}
                      <span className="sr-only">Submitting...</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => cancelASubscription(subscription.id)}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-md"
                    >
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              )
          )}
          <button
            type="button"
            onClick={routeToNewSubscription}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Add Subscription
          </button>
        </div>
      </div>

      {errorMessage && <div className="mt-4 text-red-600 text-sm">{errorMessage}</div>}
    </div>
  );
}
