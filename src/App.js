import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/login.component';
import SignUp from './components/signup.component';
import NewSubscriber from './components/new-subscriber.component'
import Header from './components/header.component';
import { useLocation } from 'react-router-dom';
import canRoute from './util/authRouter';
import { useSelector } from 'react-redux';


const LOGIN_IN_PATH = '/log-in';
const SIGN_UP_PATH = '/sign-up';
const ROOT_PATH = '/';
const SUBSCRIBER_PATH = '/subscriber';


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
        <div className='auth-wrapper'>
          <div className='auth-inner'>
            <Routes>
              <Route exact path={ROOT_PATH} element={<Login />}></Route>
              <Route path={LOGIN_IN_PATH} element={<Login />}></Route>
              <Route path={SIGN_UP_PATH} element={<SignUp />}></Route>
              <Route path={SUBSCRIBER_PATH} element={<NewSubscriber />}></Route>
            </Routes>
          </div>
        </div>
      </div>
  );
};
