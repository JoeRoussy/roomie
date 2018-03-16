/*
    This is a collection of useful functions that are not really specific to react or redux
*/

import axios from 'axios';
import { push } from 'react-router-redux';

// Set the value of the authentication header
// If we pass a falsey value, it will remove the authorization header
export const setAuthorizationToken = token => {
    if (token) {
        // We want to configure our HTTP requests with our JWT token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        // Remove the configuration
        delete axios.defaults.headers.common['Authorization'];
    }
}

export const setJwt = (token) => {
    if (token) {
        localStorage.setItem('jwtToken', token);
    } else {
        localStorage.removeItem('jwtToken');
    }

    setAuthorizationToken(token);
}

// Given the dispatch function, returns a function that uses redux to change the path
export const navigateTo = (dispatch) => (path) => dispatch(push(path));
