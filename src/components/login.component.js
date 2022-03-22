import React, { Component } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
export default class Login extends Component {
  render() {
    return (
      <form>
        <div className='mb-3'>
          <label for='exampleInputEmail1' class='form-label'>
            Email address
          </label>
          <input
            type='email'
            className='form-control'
            placeholder='Enter email'
          />
        </div>
        <div className='mb-3'>
          <label>Password</label>
          <input
            type='password'
            className='form-control'
            placeholder='Enter password'
          />
        </div>
        <button type='submit' className='btn btn-primary btn-block'>
          Submit
        </button>
        <p className='forgot-password text-right'>
          Forgot <a href='#'>password?</a>
        </p>
      </form>
    );
  }
}
