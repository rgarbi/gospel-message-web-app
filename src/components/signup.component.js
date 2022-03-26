import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import getServerAddress from '../util/serverLocation';
import signUp from '../api/client';
import { addToken } from '../store/auth/token';
import { storeEmailAddress, storePassword } from '../store/auth/credentials';

export default function SignUp() {

  //const [emailAddress, addEmail] = useState('');
  //const [password, storePassword] = useState('');
  const token = useSelector(state => state.token);
  const creds = useSelector(state => state.credentials)
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
    event.preventDefault();
    console.log('Token state: ', token);
    console.log('Creds Store:', creds);

    let address = getServerAddress();
    let response = await signUp(address, creds.emailAddress, creds.password);

    if(response.statusCode < 300) {
      console.log(response.object);
      dispatch(addToken(response.object));
    }

    if(response.statusCode === 409) {
      console.log('There is already an account with that Email Address.');
    }

  };


    return (
      <form id="signUpForm">
        <h3>Sign Up</h3>
        <div className='form-group'>
          <label>Email address</label>
          <input
            type='email'
            className='form-control'
            placeholder='Enter email'
            onChange={evt => setEmail(evt.target.value)}
            //value={emailAddress}
            id='emailAddress'
          />
        </div>
        <div className='form-group'>
          <label>Password</label>
          <input
            type='password'
            className='form-control'
            placeholder='Enter password'
            onChange={evt => setPassword(evt.target.value)}
            //value={password}
            id='password'
          />
        </div>
        <p></p>
        <div>{}</div>
        <p></p>
        <input type="button" className='btn btn-primary btn-block' value="Sign Up" onClick={evt => handleSubmit(evt)}/>
        <p className='forgot-password text-right'>
          Already registered <a href='#'>sign in?</a>
        </p>
      </form>
    );
}
