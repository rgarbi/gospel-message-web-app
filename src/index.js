import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import authApp from './store/auth/token';
import { createBrowserHistory } from 'history';
import { BrowserRouter as Router } from 'react-router-dom';

const store = createStore(authApp);

let history = createBrowserHistory();
  history.listen(({ location, action }) => {
    console.log('Location: ', location);
    console.log('Action: ', action);
  });


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
