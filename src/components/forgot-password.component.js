import React, { useState } from 'react';

import getServerAddress from '../util/serverLocation';
import { forgotPassword } from '../api/client';


export default function ForgotPassword() {
  const [emailAddress, addEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    let address = getServerAddress();
    let response = await forgotPassword(address, emailAddress);

    if(response.statusCode < 300) {
      setMessage('If a user with that email exists we have sent them instructions for resetting their password.');
    }

    if(response.statusCode > 399) {
      setMessage('Something went wrong');
    }

  };


  return (
      <form onSubmit={handleSubmit}>
        <h1>Forgot Password</h1>
        <p>Enter the email address for your account.</p>
        <div className='form-group'>
          <label>Email address</label>
          <input
            type='email'
            className='form-control'
            placeholder='Enter email'
            onChange={evt => addEmail(evt.target.value)}
            value={emailAddress}
            id='emailAddress'
          />
        </div>
        <p></p>
        <div>{message}</div>
        <p></p>
        <button type='submit' className='btn btn-primary btn-block'>
          Submit
        </button>
      </form>
    );
}
