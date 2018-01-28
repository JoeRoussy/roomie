import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux'
import jwtDecode from 'jwt-decode';
import store, { history } from './redux/store';
import App from './react/containers/app';
import { setAuthorizationToken } from './components';
import { setCurrentUser } from './redux/actions/userActions';

/* Configure intial user state based on jwt in local storage */
if (localStorage.jwtToken) {
    // Make all our requests include the JWT
    setAuthorizationToken(localStorage.jwtToken);
    // Decode the user from the token and dispatch an action to put it in the state
    store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)));
}

const target = document.getElementById('app');

ReactDOM.render(
		<Provider store={store}>
            <ConnectedRouter history={history}>
                <App />
            </ConnectedRouter>
		</Provider>,
        target
);
