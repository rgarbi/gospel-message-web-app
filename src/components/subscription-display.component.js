import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import getServerAddress from '../util/serverLocation';
import { getSubscriber, getSubscriptionsBySubscriberId, manageStripeSubscription, cancelSubscription } from '../api/client';
import Card  from 'react-bootstrap/Card';
import ListGroup  from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'

export default function DisplaySubscription(props) {
  const subscription = props.subscription;
  return (
    <Row>
      <Card.Header>
        <Row>
          <Col><Card.Title>Subscription for: {subscription.subscription_name}</Card.Title></Col>
          <Col><Button variant="secondary" style={{float:'right'}} onClick={() => {}} disabled>Edit</Button></Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <Card.Subtitle className="mb-2 text-muted">Subscription Details</Card.Subtitle>
        <Card>
          <ListGroup>
            <ListGroup.Item className=''>Name: {subscription.subscription_name}
            <Form.Control type="text" id="subscription_name" className='visually-hidden' defaultValue={subscription.subscription_name}/>
            </ListGroup.Item>
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
    </Row>
                              
  );
  
};
