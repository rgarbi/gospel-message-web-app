import React from 'react';
import Container  from 'react-bootstrap/Container';
import Card  from 'react-bootstrap/Card';
import Col  from 'react-bootstrap/Col';
import Row  from 'react-bootstrap/Row';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import LogIn from './components/login.component';
import SignUp from './components/signup.component';


export default function Auth() {
    return (
        <Container className="p-5 ">
            <Row>
                <Col >
                    <Card className="p-5 border border-light rounded-3 text-start">
                        
                        <Tabs defaultActiveKey="login" id="l" className="mb-3">
                            <Tab eventKey="login" title="Log In">
                                <LogIn />
                            </Tab>
                            <Tab eventKey="signup" title="Sign Up">
                                <SignUp />
                            </Tab>
                        </Tabs> 
                        
                    </Card>
                </Col>
            </Row>
        </Container>
    );
        
       
}