import axios from 'axios';

/*
    Since we are using the redux-promise-middleware, returning a promise as the payload of an action
    dispatches that action but will also dispatch GET_LISTINGS_PENDING, GET_LISTINGS_FULFILLED, and GET_LISTINGS_REJECTED
    as appropriate.

    So GET_LISTINGS_PENDING will be dispathced after this action is dispatched and then GET_LISTINGS_FULFILLED or GET_LISTINGS_REJECTED
    will be dispatched once the promise is rejected or fulfilled
*/

export const getListings = () => ({
    type: 'GET_LISTINGS',
    payload: axios.get(`${process.env.API_ROOT}/api/listings`)
});

export const getListingById = (id) => ({
    type: 'GET_LISTING_BY_ID',
    payload: axios.get(`${process.env.API_ROOT}/api/listings/${id}`)
});
