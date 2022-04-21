import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Card  from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function CheckoutSuccess() {
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();
  let navigate = useNavigate();


  React.useEffect(() => {
    console.log('Use effect ran');
    const validateOTP = async () => {
      
      let sessionIdFromParam = searchParams.get("session_id");

      if(!sessionIdFromParam) {
        navigate("/");
      } else {
        console.log('GOT THE SESSION ID: ' + sessionIdFromParam);
        setSessionId(sessionIdFromParam);
        //Probably will need to post to the server to complete the transaction on our side.
      }
      
    };

    
    validateOTP();
    
  }, [navigate, searchParams, sessionId]);


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
