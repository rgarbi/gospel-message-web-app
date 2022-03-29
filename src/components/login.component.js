import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import getServerAddress from '../util/serverLocation';
import { logIn } from '../api/client';
import { addToken } from '../store/auth/token';


export default function LogIn() {
  const [emailAddress, addEmail] = useState('');
  const [password, addPassword] = useState('');
  const state = useSelector(state => state.authReducer);
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(emailAddress);
    console.log(password);

    console.log('Token state: ', state.token);

    let address = getServerAddress();
    let response = await logIn(address, emailAddress, password);

    if(response.statusCode < 300) {
      let token = response.object
      console.log(token);
      dispatch(addToken(token));
    }

    if(response.statusCode === 409) {
      console.log('There is already an account with that Email Address.');
    }

  };


  return (
      <form  onSubmit={handleSubmit}>
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
        <div className='form-group'>
          <label>Password</label>
          <input
            type='password'
            className='form-control'
            placeholder='Enter password'
            onChange={evt => addPassword(evt.target.value)}
            value={password}
            id='password'
          />
        </div>
        <button type='submit' className='btn btn-primary btn-block'>
          Submit
        </button>
        <p className='forgot-password text-right'>
          Forgot <a href='#'>password?</a>
        </p>
      </form>
    );
  
}
