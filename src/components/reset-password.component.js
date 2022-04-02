import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import getServerAddress from '../util/serverLocation';
import { logIn } from '../api/client';
import { addToken } from '../store/auth/token';


export default function LogIn() {
  const [emailAddress, addEmail] = useState('');
  const [password, addPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const state = useSelector(state => state.authReducer);
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    let address = getServerAddress();
    let response = await logIn(address, emailAddress, password);

    if(response.statusCode < 300) {
      let token = response.object;
      dispatch(addToken(token));
      //route to subscriber
      navigate("/subscriber");
    }

    if(response.statusCode > 399) {
      setErrorMessage('Incorrect Email Address or Password.');
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
        <p></p>
        <div>{errorMessage}</div>
        <p></p>
        <button type='submit' className='btn btn-primary btn-block'>
          Submit
        </button>
        <p className='forgot-password text-right'>
          Forgot <a href='#'>password?</a>
        </p>
      </form>
    );
  
}
