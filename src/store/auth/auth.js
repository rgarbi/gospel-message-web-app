import { combineReducers } from 'redux';
const ADD_AUTH = 'ADD_AUTH';
const CLEAR_AUTH = 'CLEAR_AUTH';

export function addAuth(auth) {
    return {
      type: ADD_AUTH,
      auth,
    }
}

export function clearAuth() {
    return {
      type: CLEAR_AUTH,
      auth,
    }
}

  const defaultAuth = {};


  function auth(state=defaultAuth, action) {
    switch (action.type) {
        case ADD_AUTH:
           let newState = { ...state};
           newState = action.auth;
           return newState;
        case CLEAR_AUTH:
            let clearedAuth = { ...state};
            clearedAuth = {};
            return clearedAuth;
        default:
          return state;
      }
  }

const authApp = combineReducers({
    auth
  });
  
export default authApp;