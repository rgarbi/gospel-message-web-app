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

  const defaultToken = {};


  function token(state=defaultToken, action) {
    switch (action.type) {
        case ADD_AUTH:
           let newState = { ...state};
           newState = action.token;
           return newState;
        case CLEAR_AUTH:
            let clearedAuth = { ...state};
            clearedAuth = {};
            return clearedAuth;
        default:
          return state;
      }
  }

const tokenApp = combineReducers({
  token
  });
  
export default tokenApp;