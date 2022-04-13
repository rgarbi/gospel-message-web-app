import React from 'react';
import { Link } from 'react-router-dom';


export default function Header() {
  return (
    <nav className='navbar navbar-expand-lg navbar-light'>
      <div className='container'>
          <Link className='navbar-brand' to={'/'}>
            Gospel Message Subscription
          </Link>
      </div>
    </nav>
  );
}