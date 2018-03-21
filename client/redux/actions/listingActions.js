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

export const getMyListings = () => ({
    type: 'GET_MY_LISTINGS',
    payload: axios.get(`${process.env.API_ROOT}/api/myListings`)
        .catch((e) => {
            toast.error('Error retrieving your listings.');
            return e;
        })
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
            dispatch({
                type: 'CREATE_LISTING_REJECTED',
                payload: e
            });
        });
};

export const submitUpdateForm = (formValues, id) => (dispatch) => {
    dispatch({
        type: 'UPDATE_LISTING_SUBMIT'
    });

    const formSubmission = buildFormSubmissionData(formValues, [ 'images' ]);

    axios.put(`${process.env.API_ROOT}/api/listings/${id}`, formSubmission)
        .then(res => {
            const {
                data: {
                    listing
                } = {}
            } = res;

            toast.success('You have updated the listing!');

            dispatch({
                type: 'UPDATE_LISTING_FULFILLED',
                payload: res
            });
        })
        .catch(e => {
            console.log(e);
            dispatch({
                type: 'UPDATE_LISTING_REJECTED',
                payload: e
            });
        });
};

export const editListing = () => ({
    type: 'EDIT_LISTING'
});

export const cancelEditListing = () => ({
    type: 'EDIT_LISTING_CANCELLED'
});

export const deletingListing = (listingToDelete) => ({
    type: 'DELETING_LISTING',
    payload: listingToDelete
})

export const cancelDeletingListing = () => ({
    type: 'DELETING_LISTING_CANCELLED'
})

export const deleteMyListing = (id) => (dispatch) => {
    dispatch({
        type: 'DELETE_LISTING_PENDING'
    });

    axios.delete(`${process.env.API_ROOT}/api/myListings/${id}`)
        .then(res => {
            toast.success('You have deleted the listing!');
            dispatch({
                type: 'DELETE_LISTING_FULFILLED'
            });
            dispatch(getMyListings());
        })
        .catch((e) => {
            toast.error('Error deleting your listing.');
            dispatch({
                type: 'DELETE_LISTING_REJECTED',
                payload: e
            });
        });
};
