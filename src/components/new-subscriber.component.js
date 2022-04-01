import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import getServerAddress from '../util/serverLocation';
import { getSubscriber } from '../api/client';

export default function NewSubscriber() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [subscriberId, setSubscriberId] = useState('');

  const state = useSelector(state => state.authReducer);
  

  React.useEffect(() => {
    const fetchSubscriber = async () => {
      let address = getServerAddress();
      const response = await getSubscriber(address, state.token.user_id, state.token.token);

      if(response.statusCode < 300) {
      let subscriber = response.object;
        setFirstName(subscriber.first_name);
        setLastName(subscriber.last_name);
        setEmailAddress(subscriber.email_address);
        setSubscriberId(subscriber.id);
        console.log(subscriber);
      }
    };

    fetchSubscriber();
    
  });


    return (
      <div>
        <h3>Welcome</h3>
        <div className='form-group'>
          <label>First name</label>
          <div>{firstName}</div>
        </div>
        <div className='form-group'>
          <label>Last name</label>
          <div>{lastName}</div>
        </div>
        <div className='form-group'>
          <label>Email address</label>
          <div>{emailAddress}</div>
        </div>
        <div className='form-group'>
          <label>Subscriber ID</label>
          <div>{subscriberId}</div>
        </div>
      </div>
    );
  
};
