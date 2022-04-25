import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Card  from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import getServerAddress from '../util/serverLocation';
import {checkoutSuccess} from '../api/client';


export default function CheckoutSuccess() {
  const [sessionId, setSessionId] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

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
        setSessionId(sessionIdFromParam);
        //Probably will need to post to the server to complete the transaction on our side.
        let response = await checkoutSuccess(address, state.token.token, state.token.user_id, sessionIdFromParam);
        if(response.statusCode < 300) {
          navigate("/subscriber");
        }
      }
      
    };

    
    validateOTP();
    
  }, []);


  return (
    <Container>
      <p></p>
      <Row>
        <Col>
          <Card style={{textAlign:'left'}}>
            <Card.Body>
              <Card.Title>{sessionId}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <p></p> 
    </Container>
  );
  
}
