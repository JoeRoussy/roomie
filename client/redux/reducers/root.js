/* This module just collects all the reducers in our app and combines them */

import { combineReducers } from 'redux';
import sampleReducer from './sampleReducer';
import listingsReducer from './listingsReducer';

const reducers = combineReducers({
	sampleReducer,
    listingsReducer
});

export default reducers;
