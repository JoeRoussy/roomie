import axios from 'axios';
import { toast } from 'react-toastify';

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

export const submitForm = (formValues) => (dispatch) => {
    dispatch({
        type: 'CREATE_LISTING_SUBMIT'
    });

    // TODO: Pass the user id in here as well.
    axios.post(`${process.env.API_ROOT}/api/listings`, formValues)
        .then(res => {
            const {
                data: {
                    listing
                } = {}
            } = res;

            toast.success('You have posted the listing!');

            dispatch({
                type: 'CREATE_LISTING_FULFILLED',
                payload: res
            });
        })
        .catch(e => {
            console.log(e);
            dispatch({
                type: 'CREATE_LISTING_REJECTED',
                payload: e
            });
        });
}
