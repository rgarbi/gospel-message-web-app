import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import getServerAddress from '../util/serverLocation';
import signUp from '../api/client';
import { addToken } from '../store/auth/token';

export default function SignUp() {

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
    let response = await signUp(address, emailAddress, password);

    if(response.statusCode < 300) {
      dispatch(addToken(response.object));
    }

    if(response.statusCode === 409) {
      console.log('There is already an account with that Email Address.');
    }

  };


    return (
      <form id="signUpForm" onSubmit={handleSubmit}>
        <h3>Sign Up</h3>
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
        <p></p>
        <div>{}</div>
        <p></p>
        <input type="submit" className='btn btn-primary btn-block' value="Sign Up" />
        <p className='forgot-password text-right'>
          Already registered <a href='#'>sign in?</a>
        </p>
      </form>
    );
}
