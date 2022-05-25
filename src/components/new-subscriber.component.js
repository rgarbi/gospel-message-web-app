import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import getServerAddress from '../util/serverLocation';
import { getSubscriber, getSubscriptionsBySubscriberId, manageStripeSubscription, cancelSubscription } from '../api/client';
import Card  from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import DisplaySubscription from './subscription-display.component'

export default function NewSubscriber() {
  const CHANGE_PAYMENT_METHOD_BUTTON_TEXT = 'Change Payment Method';
  const [name, setName] = useState('');
  const [value, setValue] = useState(0);
  const [subscriptions, setSubscriptions] = useState([]);
  const [buttonText, setButtonText] = useState(CHANGE_PAYMENT_METHOD_BUTTON_TEXT);
  const [changePaymentMewthodButtonDisabled, setChangePaymentMewthodButtonDisabled] = useState(false);
  const [loadingSpinnerClass, setLoadingSpinnerClass] = useState('visually-hidden');
  const [errorMessage, setErrorMessage] = useState('');
  
  const state = useSelector(state => state.authReducer);
  let navigate = useNavigate();
  

  React.useEffect(() => {
    const fetchSubscriber = async () => {
      let address = getServerAddress();
      const response = await getSubscriber(address, state.token.user_id, state.token.token);

      if(response.statusCode < 300) {
        let subscriber = response.object;
        setName(subscriber.name);
        console.log(subscriber);

        let subscriptions_response = await getSubscriptionsBySubscriberId(address, subscriber.id, state.token.token);

        if(subscriptions_response.statusCode < 300) {
          setSubscriptions(subscriptions_response.object);
        }
      }
    };

    fetchSubscriber();
    
  }, [state.token.user_id, state.token.token, value]);

  let routeToNewSubscription = function() {
    navigate("/new-subscription");
  };

  let manageStripePaymentMethod = async function() {
    setChangePaymentMewthodButtonDisabled(true);
    setButtonText(CHANGE_PAYMENT_METHOD_BUTTON_TEXT + '...  ');
    setLoadingSpinnerClass('');

    let address = getServerAddress(); 
    let response = await manageStripeSubscription(address, state.token.token, state.token.user_id);

    if(response.statusCode < 300) {
      console.log(response);
      window.location.href = response.object.location;
    }

    if(response.statusCode > 399) {
      setErrorMessage('Missing Required field.');
      setButtonText(CHANGE_PAYMENT_METHOD_BUTTON_TEXT);
      setChangePaymentMewthodButtonDisabled(false);
      setLoadingSpinnerClass('visually-hidden');
    }
  };

  let cancelASubscription = async function(subscription_id) {
    
      let address = getServerAddress(); 
      let response = await cancelSubscription(address, state.token.token, subscription_id);

      if(response.statusCode < 300) {
        console.log(response);
      }
      setValue(value => value + 1);
      console.log(value);
    
  };


    return (
      <Container>
        <p></p>
        <Row>
          <Col>
            <Card style={{textAlign:'left'}}>
              <Card.Body>
                <Card.Title>Welcome {name}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <p></p>
        <Card>
          <Card.Header style={{textAlign:'left'}}>Subscriptions to the Gospel Message</Card.Header>
          <Card.Body>
            {
              subscriptions.map(function(subscription){
                if(subscription.active) {
                  return <Row key={subscription.id}>
                    <Col>
                      <Row>
                        <Card style={{textAlign:'left'}}>
                          <Col>
                            <DisplaySubscription subscription={subscription}></DisplaySubscription>
                            <Row>
                              <Container>
                                <Row>
                                  <Col className="col-sm">
                                    <p>
                                      <Button variant="primary" className='btn-block' onClick={function() {manageStripePaymentMethod();}} disabled={changePaymentMewthodButtonDisabled}>
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
                                    </p>
                                  </Col>
                                  <Col ></Col>
                                  <Col>
                                    <p>
                                      <Button 
                                        variant="warning" 
                                        style={{float:'right'}} 
                                        onClick={function () {
                                          cancelASubscription(subscription.id);
                                        }}
                                      >
                                        Cancel Subscription
                                      </Button></p>
                                  </Col>
                                </Row>
                              </Container>
                            </Row>
                          </Col>
                        </Card>
                      </Row>
                    </Col>
                    <p></p>
                  </Row>
                } else {
                  return '';
                }
              })
            }
            <Button variant="primary" onClick={routeToNewSubscription}>Add Subscription</Button>
          </Card.Body>
        </Card>
        <p></p>
          <div>{errorMessage}</div>
        <p></p>
        <div>
          
        </div>
      </Container>
    );
  
};
