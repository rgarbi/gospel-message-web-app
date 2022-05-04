import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import getServerAddress from '../util/serverLocation';
import { logIn, checkToken } from '../api/client';
import { addToken, clearToken } from '../store/auth/token'; 
import { isTokenEmpty, tokenIsExpired, validateCheckTokenResponseIs401 } from '../util/authRouter';


export default function LogIn() {
  const [emailAddress, addEmail] = useState('');
  const [password, addPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const state = useSelector(state => state.authReducer);
  const dispatch = useDispatch();
  let navigate = useNavigate();

  React.useEffect(() => {
    const checkForAGoodToken = async () => {
      
      if(isTokenEmpty(state.token)) {
        //DO NOTHING
      } else {
          let checkTokenResponse = await checkToken(getServerAddress(), state.token.token, state.token.user_id);
          if(tokenIsExpired(state.token) || validateCheckTokenResponseIs401(checkTokenResponse)) {
            dispatch(clearToken({}));
          } else {
            navigate("/subscriber");
          }
      }
    };

    checkForAGoodToken();
    
  }, [state.token, dispatch, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    let address = getServerAddress();
    let response = await logIn(address, emailAddress, password);

    if(response.statusCode < 300) {
      let token = response.object;
      dispatch(addToken(token));
      
      navigate("/subscriber");
    }

    if(response.statusCode > 399) {
      setErrorMessage('Incorrect Email Address or Password.');
    }

  };


  return (
      <form  onSubmit={handleSubmit}>
        <h4>Log In</h4>
        <p>Already have an account? Please log in to manage your subscription.</p>
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
        <button type='submit' className='btn btn-primary btn-block'>
          Submit
        </button>
        <p className='forgot-password'>
          Forgot <a href='/forgot-password'>password?</a>
        </p>
      </form>
    );
  
}
