import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import getServerAddress from '../util/serverLocation';
import { getSubscriber, getSubscriptionsBySubscriberId, manageStripeSubscription } from '../api/client';
import Card  from 'react-bootstrap/Card';
import ListGroup  from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function NewSubscriber() {
  const [name, setName] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);

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
    
  }, [state.token.user_id, state.token.token]);

  let routeToNewSubscription = function() {
    navigate("/new-subscription");
  };

  let manageStripePaymentMethod = async function() {
    let address = getServerAddress(); 
    let response = await manageStripeSubscription(address, state.token.token, state.token.user_id);

    if(response.statusCode < 300) {
      console.log(response);
      window.location.href = response.object.location;
    }
  };

  let cancelSubscription = async function(subscriptionId) {
    let address = getServerAddress(); 
    let response = await cancelSubscription(address, state.token.token, subscriptionId);

    if(response.statusCode < 300) {
      console.log(response);
      window.location.href = response.object.location;
    }
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
                return <Row key={subscription.id}>
                  <Col>
                    <Card style={{textAlign:'left'}}>
                      <Card.Body>
                        <Card.Title>Subscription for: {subscription.subscription_name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">Subscription Details</Card.Subtitle>
                        <Card>
                          <ListGroup>
                            <ListGroup.Item>Name: {subscription.subscription_name}</ListGroup.Item>
                            <ListGroup.Item>Address Line 1: {subscription.subscription_mailing_address_line_1}</ListGroup.Item>
                            <ListGroup.Item>Address Line 2: {subscription.subscription_mailing_address_line_2}</ListGroup.Item>
                            <ListGroup.Item>City: {subscription.subscription_city}</ListGroup.Item>
                            <ListGroup.Item>State: {subscription.subscription_state}</ListGroup.Item>
                            <ListGroup.Item>Zip: {subscription.subscription_postal_code}</ListGroup.Item>
                            <ListGroup.Item>Email Address: {subscription.subscription_email_address}</ListGroup.Item>
                            <ListGroup.Item>Subscription Type: {subscription.subscription_type}</ListGroup.Item>
                            <ListGroup.Item>Subscription Sign Up Date: {subscription.subscription_creation_date}</ListGroup.Item>
                            <ListGroup.Item>Active: {subscription.active + ''}</ListGroup.Item>
                          </ListGroup>
                        </Card>
                      </Card.Body>
                      <Row>
                        <Col ><Button variant="primary" onClick={manageStripePaymentMethod}>Change Payment Method</Button></Col>
                        <Col ><Button variant="primary" onClick={cancelSubscription}>Change Payment Method</Button></Col>
                      </Row>
                    </Card>
                  </Col>
                  <p></p>
                </Row>
              })
            }
            <Button variant="primary" onClick={routeToNewSubscription}>Add Subscription</Button>
          </Card.Body>
        </Card>
      </Container>
    );
  
};
