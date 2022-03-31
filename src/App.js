import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import Login from './components/login.component';
import SignUp from './components/signup.component';
import NewSubscriber from './components/new-subscriber.component'
import Header from './components/header.component';
function App() {

  



  return ( 
      <div className='App'>
        <Header />
        <div className='auth-wrapper'>
          <div className='auth-inner'>
            <Routes>
              <Route exact path='/' element={<Login />}></Route>
              <Route path='/sign-in' element={<Login />}></Route>
              <Route path='/sign-up' element={<SignUp />}></Route>
              <Route path='/welcome' element={<NewSubscriber />}></Route>
            </Routes>
          </div>
        </div>
      </div>
  );
}
export default App;
