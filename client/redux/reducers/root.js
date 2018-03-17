/* This module just collects all the reducers in our app and combines them */

import { combineReducers } from 'redux';

import { reducer as formReducer } from 'redux-form';

import listingReducer from './listingReducer';
import sampleReducer from './sampleReducer';
import searchReducer from './searchReducer';
import userReducer from './userReducer';
import ChatReducer from './chatReducer';
import signUpReducer from './signUpReducer';
import signInReducer from './signInReducer';
import profileReducer from './profileReducer';
import changePasswordReducer from './changePasswordReducer';
import forgotPasswordFormReducer from './forgotPasswordFormReducer';
import forgotPasswordReducer from './forgotPasswordReducer';
import locationReducer from './locationReducer';

const reducers = combineReducers({
    listingReducer,
	sampleReducer,
    searchReducer,
    userReducer,
    ChatReducer,
    form: formReducer,
    signUpReducer,
    signInReducer,
    profileReducer,
    changePasswordReducer,
    forgotPasswordFormReducer,
    forgotPasswordReducer,
    locationReducer
});

export default reducers;
