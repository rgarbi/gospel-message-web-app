import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import getServerAddress from '../util/serverLocation';
import { getSubscriber, initiateCheckout } from '../api/client';
import Form  from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

export default function NewSubscription() {
  const SUBMIT_BUTTON_TEXT = 'Submit';

  const [subscriberId, setSubscriberId] = useState('');
  const [buttonText, setButtonText] = useState(SUBMIT_BUTTON_TEXT);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loadingSpinnerClass, setLoadingSpinnerClass] = useState('visually-hidden');
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
    setButtonDisabled(true);
    setButtonText('');
    setLoadingSpinnerClass('');
    event.preventDefault();

    let address = getServerAddress();
    let response = await initiateCheckout(address, state.token.token, state.token.user_id, subscriberId, name, mailingAddressLine1, mailingAddressLine2, city, province, postalCode, emailAddress, subscriptionType, 'gmdigitalsub-test');

    if(response.statusCode < 300) {
      console.log(response);
      window.location.href = response.object.location;
    }

    if(response.statusCode > 399) {
      setErrorMessage('Missing Required field.');
      setButtonText(SUBMIT_BUTTON_TEXT);
      setButtonDisabled(false);
      setLoadingSpinnerClass('visually-hidden');
    }

  };

  return (
    <div>
      <Container className='gx-1'>
        <p></p>
        <Row>
          <Card style={{textAlign:'left'}}>
            <p></p>
            <Form onSubmit={handleSubmit} >
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="John Smith" onChange={evt => setName(evt.target.value)} value={name} required/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Mailing Address Line 1</Form.Label>
                <Form.Control type="text" placeholder="123 Main" onChange={evt => setMailingAddressLine1(evt.target.value)} value={mailingAddressLine1} required/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Mailing Address Line 2</Form.Label>
                <Form.Control type="text" placeholder="Suite 200" onChange={evt => setMailingAddressLine2(evt.target.value)} value={mailingAddressLine2} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>City</Form.Label>
                <Form.Control type="text" placeholder="City" onChange={evt => setCity(evt.target.value)} value={city} required/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>State</Form.Label>
                <Form.Control type="text" placeholder="State" onChange={evt => setProvince(evt.target.value)} value={province} required/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Postal Code</Form.Label>
                <Form.Control type="text" placeholder="12345" onChange={evt => setPostalCode(evt.target.value)} value={postalCode} required/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" placeholder="Email Address" onChange={evt => setEmailAddress(evt.target.value)} value={emailAddress} required/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicName" required>
                <Form.Label>Subscription Type</Form.Label>
                <p></p>
                <Form.Check inline label="Digital" name="group1" type="radio" onChange={evt => setSubscriptionType('Digital')} />
                <Form.Check inline label="Paper" name="group1" type="radio" onChange={evt => setSubscriptionType('Paper')} />
              </Form.Group>
                <p></p>
                <div>{errorMessage}</div>
                <p></p>
                <Button variant="primary" type="submit" disabled={buttonDisabled} onClick={()=>{}}>
                {buttonText}
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className={loadingSpinnerClass}
                />
                <span className="visually-hidden">Submitting...</span>
                </Button>
                <p></p>
            </Form>
          </Card>
        </Row>
      </Container>
    </div>
  );
  
};
