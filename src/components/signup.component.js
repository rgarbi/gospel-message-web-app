import React, { Component } from 'react';
import getServerAddress from '../util/serverLocation'
import signUp from '../api/client';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailAddress: '',
      password: ''
    };

  }

  updatePassword(event) {
    const val = event.target.value;
    this.setState({
      password: val,
    });
  }

  updateEmail(event) {
    const val = event.target.value;
  
    this.setState({
      emailAddress: val,
    });
  }

  handleSubmitEditing(event) {
    console.log('Submit Editing: ', event);
  }

  async handleSubmit(event) {
    let address = getServerAddress();
    let response = await signUp(address, this.state.emailAddress, this.state.password);

    if(response.statusCode < 300) {
      console.log(response.object);
    }

    if(response.statusCode === 409) {
        this.setState({
          errorText: 'There is already an account with that Email Address.',
        });
    }

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
            onChange={evt => this.updateEmail(evt)}
            value={this.state.emailAddress}
            id='emailAddress'
          />
        </div>
        <div className='form-group'>
          <label>Password</label>
          <input
            type='password'
            className='form-control'
            placeholder='Enter password'
            onChange={evt => this.updatePassword(evt)}
            value={this.state.password}
            id='password'
          />
        </div>
        <p></p>
        <div>{this.state.errorText}</div>
        <p></p>
        <input type="button" className='btn btn-primary btn-block' value="Sign Up" onClick={evt => this.handleSubmit(evt)}/>
        <p className='forgot-password text-right'>
          Already registered <a href='#'>sign in?</a>
        </p>
      </form>
    );
  }
}
