import React from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import LogIn from './components/login.component';
import SignUp from './components/signup.component';

export default function Auth() {
    return (
        <div className='auth-wrapper'>
          <div className='auth-inner'>
            <Tabs defaultActiveKey="login" id="login-signup" className="mb-3">
                <Tab eventKey="login" title="Log In">
                    <LogIn />
                </Tab>
                <Tab eventKey="signup" title="Sign Up">
                    <SignUp />
                </Tab>
            </Tabs>
          </div>
        </div>
    );
}