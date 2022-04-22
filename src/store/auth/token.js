import { combineReducers } from 'redux';
const ADD_AUTH = 'ADD_AUTH';
const CLEAR_AUTH = 'CLEAR_AUTH';

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
        default:
          return state;
      }
  }

const tokenApp = combineReducers({
  authReducer
  });
  
export default tokenApp;