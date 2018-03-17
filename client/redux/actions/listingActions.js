import axios from 'axios';
import { toast } from 'react-toastify';
import { push } from 'react-router-redux';

import { buildFormSubmissionData } from '../components';

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

// Create listing
export const submitCreateForm = (formValues) => (dispatch) => {
    dispatch({
        type: 'CREATE_LISTING_SUBMIT'
    });

    const formSubmission = buildFormSubmissionData(formValues, [ 'images' ]);

    axios.post(`${process.env.API_ROOT}/api/listings`, formSubmission)
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

            // Route to the view listing page with the id of this listing
            const path = `/listings/${listing._id}`;
            dispatch(push(path));
        })
        .catch(e => {
            console.log(e);
            dispatch({
                type: 'CREATE_LISTING_REJECTED',
                payload: e
            });
        });
}

export const editListing = () => ({
    type: 'EDIT_LISTING'
})

export const cancelEditListing = () => ({
    type: 'EDIT_LISTING_CANCELLED'
})
