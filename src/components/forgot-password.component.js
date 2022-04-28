import React, { useState } from 'react';

import getServerAddress from '../util/serverLocation';
import { forgotPassword } from '../api/client';

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'


export default function ForgotPassword() {
  const [emailAddress, addEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(emailAddress.length > 0) {
      let address = getServerAddress();
      let response = await forgotPassword(address, emailAddress);
      let message = 'If a user with that email exists we have sent them instructions for resetting their password.';

      if(response.statusCode < 300) {
        setMessage(message);
        addEmail('');
      }

      if(response.statusCode > 399) {
        setMessage(message);
        addEmail('');
      }
    }

  };


  return (
    <Container className="p-5 ">
      <Row>
          <Col >
              <Card className="p-5 border border-light rounded-3 text-start">
                <form onSubmit={handleSubmit}>
                  <h4>Forgot Password</h4>
                  <p>Enter the email address for your account.</p>
                  <div className='form-group'>
                    <label>Email address</label>
                    <input
                      type='email'
                      className='form-control'
                      placeholder='Enter email'
                      onChange={evt => addEmail(evt.target.value)}
                      value={emailAddress}/>
                  </div>
                  <p></p>
                  <div>{message}</div>
                  <p></p>
                  <button type='submit' className='btn btn-primary btn-block'>Submit</button>
                </form>
              </Card>
          </Col>
      </Row>
    </Container>
  );
}
