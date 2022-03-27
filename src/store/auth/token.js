import { combineReducers } from 'redux';
const ADD_AUTH = 'ADD_AUTH';
const CLEAR_AUTH = 'CLEAR_AUTH';
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

export function addToken(token) {
    return {
      type: ADD_AUTH,
      token,
    }
}

export function clearToken(token) {
    return {
      type: CLEAR_AUTH,
      token,
    }
}

  const defaultState = {
    emailAddress: '',
    password: '',
    token: {},
  };


  function authReducer(state=defaultState, action) {
    switch (action.type) {
        case ADD_AUTH:
           let newState = { ...state};
           newState.token = action.token;
           return newState;
        case CLEAR_AUTH:
            let clearedAuth = { ...state};
            clearedAuth.token = {};
            return clearedAuth;
        case STORE_EMAIL_ADDRESS:
          let newEmailState = { ...state};
          newEmailState.emailAddress = action.emailAddress;
          console.log(newEmailState);
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

const tokenApp = combineReducers({
  authReducer
  });
  
export default tokenApp;