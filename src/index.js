import React from 'react';
import { createRoot } from 'react-dom/client';
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

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
);
