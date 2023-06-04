import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Spinner  from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';


import getServerAddress from '../util/serverLocation';
import {checkoutSuccess} from '../api/client';


export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();

  const state = useSelector(state => state.authReducer);
  let navigate = useNavigate();


  React.useEffect(() => {
    console.log('Use effect ran');
    const validateOTP = async () => {
      
      let sessionIdFromParam = searchParams.get("session_id");
      let address = getServerAddress();

      if(!sessionIdFromParam) {
        navigate("/");
      } else {
        console.log('GOT THE SESSION ID: ' + sessionIdFromParam);
        //Probably will need to post to the server to complete the transaction on our side.
        let response = await checkoutSuccess(address, state.token.token, state.token.user_id, sessionIdFromParam);
        if(response.statusCode < 300) {
          navigate("/subscriber");
        }
      }
      
    };

    
    validateOTP();
    
  }, [navigate, searchParams, state.token.token, state.token.user_id]);


  return (
    <Container>
      <p></p>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <p></p> 
    </Container>
  );
  
}
