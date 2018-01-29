/* This module just collects all the reducers in our app and combines them */

import { combineReducers } from 'redux';

import { reducer as formReducer } from 'redux-form';

import listingsReducer from './listingsReducer';
import sampleReducer from './sampleReducer';
import searchReducer from './searchReducer';
import userReducer from './userReducer';
import signUpReducer from './signUpReducer';
import signInReducer from './signInReducer';
import profileReducer from './profileReducer';

const reducers = combineReducers({
    listingsReducer,
	sampleReducer,
    searchReducer,
    userReducer,
    form: formReducer,
    signUpReducer,
    signInReducer,
    profileReducer
});

export default reducers;
