import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import NewSubscriber from './components/new-subscriber.component'
import Header from './components/header.component';
import { useLocation } from 'react-router-dom';
import { canRoute } from './util/authRouter';
import { useSelector } from 'react-redux';
import Auth from './Auth';
import ForgotPassword from './components/forgot-password.component';
import ResetPassword from './components/reset-password.component';
import NewSubscription from './components/add-subscription.component';
import CheckoutSuccess from './components/checkout-success.component';

const ROOT_PATH = '/';
const FORGOT_PASSWORD = '/forgot-password'
const RESET_PASSWORD = '/reset-password'
const SUBSCRIBER_PATH = '/subscriber';
const NEW_SUBSCRIPTION = '/new-subscription';
const CHECKOUT_SUCCESS = '/checkout-success';


export default function App() {
  const state = useSelector(state => state.authReducer);
  let navigate = useNavigate();

  const location = useLocation();
  React.useEffect(() => {
    // runs on location, i.e. route, change
    console.log('handle route change here', location)
    if(!canRoute(location.pathname, state.token)) {
      navigate("/");
    }
  }, [location, state.token, navigate]);


  return ( 
      <div className='App'>
        <Header />
        <Routes>
          <Route exact path={ROOT_PATH} element={<Auth />}></Route>
          <Route path={SUBSCRIBER_PATH} element={<NewSubscriber />}></Route>
          <Route path={FORGOT_PASSWORD} element={<ForgotPassword />}></Route>
          <Route path={RESET_PASSWORD} element={<ResetPassword />}></Route>
          <Route path={NEW_SUBSCRIPTION} element={<NewSubscription />}></Route>
          <Route path={CHECKOUT_SUCCESS} element={<CheckoutSuccess />}></Route>
        </Routes>
          
      </div>
  );
};
