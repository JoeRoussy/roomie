import { combineReducers, createStore, applyMiddleware } from 'redux';
import sampleReducer from './reducers/sampleReducer';
import listingsReducer from './reducers/listingsReducer';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

/* Combines all reducers into one */
const reducer = combineReducers({
	sampleReducer,
    listingsReducer
});

/* Combines middleware all into one */
const middleware = applyMiddleware(promise(), thunk);

/* Global store used throughout the app */
export default createStore(reducer, middleware);
