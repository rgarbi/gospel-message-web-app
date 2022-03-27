import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import getServerAddress from '../util/serverLocation';
import signUp from '../api/client';
import { addToken, storeEmailAddress, storePassword } from '../store/auth/token';

export default function SignUp() {

  const [emailAddress, addEmail] = useState('');
  const [password, addPassword] = useState('');
  const state = useSelector(state => state.authReducer);
  const dispatch = useDispatch();

  const setEmail = (email) => {
    console.log(email);
    dispatch(storeEmailAddress(email));
  };

  const setPassword = (password) => {
    console.log(password);
    dispatch(storePassword(password));
  };

  const handleSubmit = async (event) => {
    console.log('HELLO')
    event.preventDefault();
    
    console.log(emailAddress);
    console.log(password);

    dispatch(storeEmailAddress(emailAddress));
    dispatch(storePassword(password));

    console.log('Token state: ', state);
    console.log('Creds Store:', state.emailAddress, state.password);

    let address = getServerAddress();
    let response = await signUp(address, state.emailAddress, state.password);

    if(response.statusCode < 300) {
      console.log(response.object);
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
