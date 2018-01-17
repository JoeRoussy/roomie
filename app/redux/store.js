import { combineReducers, createStore } from 'redux';
import sampleReducer from './reducers/sampleReducer';
/* Combines all reducers into one */
const reducer = combineReducers({
	sampleReducer
});
/* Global store used throughout the app */
export default createStore(reducer);