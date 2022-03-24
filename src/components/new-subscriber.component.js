import React, { Component } from 'react';
export default class NewSubscriber extends Component {
  render() {
    return (
      <form>
        <h3>New Subscriber</h3>
        <div className='form-group'>
          <label>First name</label>
          <input
            type='text'
            className='form-control'
            placeholder='First name'
          />
        </div>
        <div className='form-group'>
          <label>Last name</label>
          <input type='text' className='form-control' placeholder='Last name' />
        </div>
        <div className='form-group'>
          <label>Email address</label>
          <input
            type='email'
            className='form-control'
            placeholder='Enter email'
          />
        </div>
        <button type='submit' className='btn btn-primary btn-block'>
          Save
        </button>
      </form>
    );
  }
}
