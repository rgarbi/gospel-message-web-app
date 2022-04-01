import { useSelector } from 'react-redux';

import getServerAddress from '../util/serverLocation';
import { getSubscriber } from '../api/client';

export default function NewSubscriber() {
  const state = useSelector(state => state.authReducer);
  let address = getServerAddress();

  const subscriber = getSubscriber(address, state.token.user_id, state.token.token);


    return (
      <div>
        <h3>Welcome</h3>
        <div className='form-group'>
          <label>First name</label>
          <div>a {subscriber.first_name}</div>
        </div>
        <div className='form-group'>
          <label>Last name</label>
          <div>{subscriber.last_name}</div>
        </div>
        <div className='form-group'>
          <label>Email address</label>
          <div>{subscriber.email_address}</div>
        </div>
      </div>
    );
  
};
