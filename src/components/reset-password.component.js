import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import getServerAddress from '../util/serverLocation';
import { exchangeOtpForToken, forgotPasswordResetPassword } from '../api/client';
import { clearToken } from '../store/auth/token';


export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();
  let navigate = useNavigate();


  React.useEffect(() => {
    console.log('Use effect ran');
    const validateOTP = async () => {
      let address = getServerAddress();
      let otp = searchParams.get("otp");

      if(!otp) {
        navigate("/");
      } else {

        const response = await exchangeOtpForToken(address, otp);

        if(response.statusCode > 300) {
          console.log('yup, bad code');
          setErrorMessage('Something something try again.')
        }

        if(response.statusCode < 300) {
          let token = response.object;
          setTempToken(token.token);
          setUserId(token.user_id);
        }

      }
      
    };

    
    validateOTP();
    
  }, [navigate, searchParams]);



  const handleSubmit = async (event) => {
    event.preventDefault();

    let address = getServerAddress();
    let response = await forgotPasswordResetPassword(address, tempToken, userId, password);

    if(response.statusCode < 300) {
      dispatch(clearToken());
      //route to home
      navigate("/");
    }

    if(response.statusCode > 399) {
      setErrorMessage('Something happened!');
    }

  };


  return (
      <form  onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Password</label>
          <input
            type='password'
            className='form-control'
            placeholder='Enter password'
            onChange={evt => setPassword(evt.target.value)}
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
      </form>
    );
  
}
