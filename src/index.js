import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authApp from './store/auth/token';
import { BrowserRouter as Router } from 'react-router-dom';
import { loadState, saveState } from './localStorage';


const store = configureStore({reducer: authApp, preloadedState: loadState(),});

store.subscribe(() => {
  saveState(store.getState());
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
