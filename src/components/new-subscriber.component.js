import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import getServerAddress from '../util/serverLocation';
import { getSubscriber, getSubscriptionsBySubscriberId } from '../api/client';
import Card  from 'react-bootstrap/Card';
import ListGroup  from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function NewSubscriber() {
  const [name, setName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [subscriberId, setSubscriberId] = useState('');
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
        setEmailAddress(subscriber.email_address);
        setSubscriberId(subscriber.id);
        console.log(subscriber);

        let subscriptions_response = await getSubscriptionsBySubscriberId(address, subscriber.id);

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


    return (
      <Container>
        <p></p>
        <Row>
          <Col>
            <Card style={{textAlign:'left'}}>
              <Card.Body>
                <Card.Title>Welcome {name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Subscriber Details</Card.Subtitle>
              </Card.Body>
              <ListGroup className="list-group-flush">
                    <ListGroup.Item>Name: {name}</ListGroup.Item>
                    <ListGroup.Item>Email Address: {emailAddress}</ListGroup.Item>
                    <ListGroup.Item>Subscriber ID: {subscriberId}</ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
        <p></p>
        <Card>
          <Card.Header style={{textAlign:'left'}}>Subscriptions</Card.Header>
          <Card.Body>
            {
              subscriptions.map(function(subscription){
                return <Row key={subscription.id}>
                  <Col>
                    <Card style={{textAlign:'left'}}>
                      <Card.Body>
                        <Card.Title>Subscription for: {subscription.subscription_first_name} {subscription.subscription_last_name}</Card.Title>
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
                            <ListGroup.Item>Active: {subscription.active}</ListGroup.Item>
                          </ListGroup>
                        </Card>
                      </Card.Body>
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
