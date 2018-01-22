/* This module just collects all the reducers in our app and combines them */

import { combineReducers } from 'redux';
import sampleReducer from './sampleReducer';
import listingsReducer from './listingsReducer';
import userReducer from './userReducer';
import { reducer as formReducer } from 'redux-form';

const reducers = combineReducers({
	sampleReducer,
    listingsReducer,
    userReducer,
    form: formReducer
});

export default reducers;
