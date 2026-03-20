import React from 'react';

export default function DisplaySubscription({ subscription }) {
  const details = [
    { label: 'Name', value: subscription.subscription_name },
    { label: 'Address Line 1', value: subscription.subscription_mailing_address_line_1 },
    { label: 'Address Line 2', value: subscription.subscription_mailing_address_line_2 },
    { label: 'City', value: subscription.subscription_city },
    { label: 'State', value: subscription.subscription_state },
    { label: 'Zip', value: subscription.subscription_postal_code },
    { label: 'Email Address', value: subscription.subscription_email_address },
    { label: 'Subscription Type', value: subscription.subscription_type },
    { label: 'Renews On', value: subscription.subscription_renewal_date },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Subscription for: {subscription.subscription_name}</h3>
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-2">Subscription Details</p>
        <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
          {details.map(({ label, value }) => (
            <div key={label} className="px-4 py-2">
              {label}: {value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
