import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom';

import getServerAddress from '../util/serverLocation';
import { getSubscriber, initiateCheckout } from '../api/client';
import Form  from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function NewSubscription() {
  let navigate = useNavigate();
  const [subscriberId, setSubscriberId] = useState('');

  const [name, setName] = useState('');
  const [mailingAddressLine1, setMailingAddressLine1] = useState('');
  const [mailingAddressLine2, setMailingAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [subscriptionType, setSubscriptionType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const state = useSelector(state => state.authReducer);
  

  React.useEffect(() => {
    const fetchSubscriber = async () => {
      let address = getServerAddress();
      const response = await getSubscriber(address, state.token.user_id, state.token.token);

      if(response.statusCode < 300) {
        let subscriber = response.object;
  
        setSubscriberId(subscriber.id);
        console.log(subscriber);

      }
    };

    fetchSubscriber();
    
  }, [state.token.user_id, state.token.token]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    let address = getServerAddress();
    let response = await initiateCheckout(address, state.token.token, state.token.user_id, subscriberId, name, mailingAddressLine1, mailingAddressLine2, city, province, postalCode, emailAddress, subscriptionType, 'gmdigitalsub-test');

    if(response.statusCode < 300) {
      //route to subscriber
      navigate("/subscriber");
    }

    if(response.statusCode > 399) {
      setErrorMessage('Incorrect Email Address or Password.');
    }

  };

  return (
    <Container>
      <Card style={{textAlign:'left'}}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="John Smith" onChange={evt => setName(evt.target.value)} value={name} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Mailing Address Line 1</Form.Label>
            <Form.Control type="text" placeholder="123 Main" onChange={evt => setMailingAddressLine1(evt.target.value)} value={mailingAddressLine1} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Mailing Address Line 2</Form.Label>
            <Form.Control type="text" placeholder="Suite 200" onChange={evt => setMailingAddressLine2(evt.target.value)} value={mailingAddressLine2} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>City</Form.Label>
            <Form.Control type="text" placeholder="City" onChange={evt => setCity(evt.target.value)} value={city} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>State</Form.Label>
            <Form.Control type="text" placeholder="State" onChange={evt => setProvince(evt.target.value)} value={province} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control type="text" placeholder="12345" onChange={evt => setPostalCode(evt.target.value)} value={postalCode} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Email Address</Form.Label>
            <Form.Control type="email" placeholder="Email Address" onChange={evt => setEmailAddress(evt.target.value)} value={emailAddress} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Subscription Type</Form.Label>
            <p></p>
            <Form.Check inline label="Digital" name="group1" type="radio" onChange={evt => setSubscriptionType('Digital')} />
            <Form.Check inline label="Paper" name="group1" type="radio" onChange={evt => setSubscriptionType('Paper')} />
          </Form.Group>
          
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Card>
    </Container>
  );
  
};
