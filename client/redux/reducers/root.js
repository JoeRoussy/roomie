/* This module just collects all the reducers in our app and combines them */

import { combineReducers } from 'redux';
import sampleReducer from './sampleReducer';
import listingsReducer from './listingsReducer';
import userReducer from './userReducer';

const reducers = combineReducers({
	sampleReducer,
    listingsReducer,
    userReducer
});

export default reducers;
