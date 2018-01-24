import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import createHistory from 'history/createBrowserHistory';
import reducers from './reducers/root';
import { setCurrentUser } from './actions/userActions';

// Export this so we can access it from elsewhere
export const history = createHistory();

// Also export this so it can be accessed
export const setAuthorizationToken = (token) => {
    if (token) {
        // We want to configure our HTTP requests with our JWT token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        // Remove the configuration
        delete axios.defaults.headers.common['Authorization'];
    }
}

/* Combines middleware all into one */
const middleware = applyMiddleware(promise(), thunk, routerMiddleware(history));

/* Create the store using our reducers, initialState, and middleware */
const store = createStore(reducers, middleware);

/* Configure intial user state based on jwt in local storage */
if (localStorage.jwtToken) {
    // Make all our requests include the JWT
    setAuthorizationToken(localStorage.jwtToken);
    // Decode the user from the token and dispatch an action to put it in the state
    store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)));
}


export default store;
