import { combineReducers } from 'redux';
const STORE_EMAIL_ADDRESS = 'STORE_EMAIL_ADDRESS';
const STORE_PASSWORD = 'STORE_PASSWORD';
const CLEAR_CREDENTIALS = 'CLEAR_CREDENTIALS';

export function storeEmailAddress(creds) {
    return {
      type: STORE_EMAIL_ADDRESS,
      creds,
    }
}

export function storePassword(creds) {
  return {
    type: STORE_PASSWORD,
    creds,
  }
}

export function clearCedentials(creds) {
    return {
      type: CLEAR_CREDENTIALS,
      creds,
    }
}

  const defaultCreds = {
    emailAddress: '',
    password: '',
  };


  function credentials(state=defaultCreds, action) {
    switch (action.type) {
        case STORE_EMAIL_ADDRESS:
           let newEmailState = { ...state};
           newEmailState.emailAddress = action.emailAddress;
           return newEmailState;
        case STORE_PASSWORD:
            let newPasswordState = { ...state};
            newPasswordState.password = action.password;
            return newPasswordState;
        case CLEAR_CREDENTIALS:
            let clearedCreds = { ...state};
            clearedCreds = {
              emailAddress: '',
              password: '',
            };
            return clearedCreds;
        default:
          return state;
      }
  }

const credentialsApp = combineReducers({
  credentials
  });
  
export default credentialsApp;