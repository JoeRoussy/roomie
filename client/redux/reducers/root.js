/* This module just collects all the reducers in our app and combines them */

import { combineReducers } from 'redux';

import { reducer as formReducer } from 'redux-form';

import listingReducer from './listingReducer';
import sampleReducer from './sampleReducer';
import searchReducer from './searchReducer';
import userReducer from './userReducer';
import ChatReducer from './chatReducer';
import scheduleReducer from './scheduleReducer';
import scheduleMeetingReducer from './scheduleMeetingReducer';
import signUpReducer from './signupReducer';
import signInReducer from './signInReducer';
import profileReducer from './profileReducer';
import changePasswordReducer from './changePasswordReducer';
import homeReducer from './homeReducer';
import roommateSurveyReducer from './roommateSurveyReducer';
import forgotPasswordFormReducer from './forgotPasswordFormReducer';
import forgotPasswordReducer from './forgotPasswordReducer';
import locationReducer from './locationReducer';
import leaseReducer from './leaseReducer';

const reducers = combineReducers({
    listingReducer,
	sampleReducer,
    searchReducer,
    userReducer,
    ChatReducer,
    form: formReducer,
    scheduleReducer,
    scheduleMeetingReducer,
    signUpReducer,
    signInReducer,
    profileReducer,
    changePasswordReducer,
    homeReducer,
    roommateSurveyReducer,
    forgotPasswordFormReducer,
    forgotPasswordReducer,
    locationReducer,
    leaseReducer
});

export default reducers;
