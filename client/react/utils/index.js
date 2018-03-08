// Provides functions that are used accross containers

import { push } from 'react-router-redux';

// Given the dispatch function, returns a function that uses redux to change the path
export const navigateTo = (dispatch) => (path) => dispatch(push(path));
