import React, { Component } from 'react';
import getServerAddress from '../util/serverLocation'
import signUp from '../api/client';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    console.log(event);

    let myForm = document.getElementById('signUpForm');
    let formData = new FormData(myForm);
    console.log(formData);

    let address = getServerAddress();
    console.log(address);
    
    signUp(address, formData.get('emailAddress'), formData.get('username'));
    event.preventDefault();
  }

  render() {
    return (
      <form id="signUpForm" onSubmit={this.handleSubmit}>
        <h3>Sign Up</h3>
        <div className='form-group'>
          <label>Email address</label>
          <input
            type='email'
            className='form-control'
            placeholder='Enter email'
            onChange={this.handleChange} 
            id='emailAddress'
          />
        </div>
        <div className='form-group'>
          <label>Password</label>
          <input
            type='password'
            className='form-control'
            placeholder='Enter password'
            onChange={this.handleChange} 
            id='password'
          />
        </div>
        <input type='submit' className='btn btn-primary btn-block' value="Sign Up"/>
        <p className='forgot-password text-right'>
          Already registered <a href='#'>sign in?</a>
        </p>
      </form>
    );
  }
}
