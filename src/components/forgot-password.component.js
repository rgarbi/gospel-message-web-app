import React, { useState } from 'react';

import getServerAddress from '../util/serverLocation';
import { forgotPassword } from '../api/client';


export default function ForgotPassword() {
  const [emailAddress, addEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(emailAddress.length > 0) {
      let address = getServerAddress();
      let response = await forgotPassword(address, emailAddress);
      let message = 'If a user with that email exists we have sent them instructions for resetting their password.';

      if(response.statusCode < 300) {
        setMessage(message);
        addEmail('');
      }

      if(response.statusCode > 399) {
        setMessage(message);
        addEmail('');
      }
    }

  };


  return (
    <div className='auth-wrapper'>
      <div className='auth-inner'>
        <form onSubmit={handleSubmit}>
          <h4>Forgot Password</h4>
          <p>Enter the email address for your account.</p>
          <div className='form-group'>
            <label>Email address</label>
            <input
              type='email'
              className='form-control'
              placeholder='Enter email'
              onChange={evt => addEmail(evt.target.value)}
              value={emailAddress}
            />
          </div>
          <p></p>
          <div>{message}</div>
          <p></p>
          <button type='submit' className='btn btn-primary btn-block'>
            Submit
          </button>
        </form>
      </div>
    </div>
    );
}
