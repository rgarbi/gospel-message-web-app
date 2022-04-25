import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import getServerAddress from '../util/serverLocation';
import { signUp } from '../api/client';
import { addToken } from '../store/auth/token';

export default function SignUp() {

  const [name, addName] = useState('');
  const [emailAddress, addEmail] = useState('');
  const [password, addPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const state = useSelector(state => state.authReducer);
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(emailAddress);
    console.log(password);

    console.log('Token state: ', state.token);

    let address = getServerAddress();
    let response = await signUp(address, emailAddress, password, name);

    if(response.statusCode < 300) {
      let token = response.object
      dispatch(addToken(token));

      //route to subscriber
      navigate("/subscriber");
    }

    if(response.statusCode === 409) {
      setErrorMessage('There is already an account with that Email Address.');
    }

  };


    return (
      <form id="signUpForm" onSubmit={handleSubmit}>
        <h3>Sign Up</h3>
        <div className='form-group'>
          <label>Name</label>
          <input
            type='text'
            className='form-control'
            placeholder='John Smith'
            onChange={evt => addName(evt.target.value)}
            value={name}
          />
        </div>
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
        <div className='form-group'>
          <label>Password</label>
          <input
            type='password'
            className='form-control'
            placeholder='Enter password'
            onChange={evt => addPassword(evt.target.value)}
            value={password}
          />
        </div>
        <p></p>
        <div>{errorMessage}</div>
        <p></p>
        <input type="submit" className='btn btn-primary btn-block' value="Sign Up" />
        <p className='forgot-password text-right'>
          Already registered <a href='/'>sign in?</a>
        </p>
      </form>
    );
}
