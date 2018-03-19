import axios from 'axios';
import { toast } from 'react-toastify';

import { userTypes } from '../../../common/constants';

export const nextStep = () => ({
    type: 'SCHEDULE_MEETING_NEXT_STEP'
});

export const previousStep = () => ({
    type: 'SCHEDULE_MEETING_PREVIOUS_STEP'
});

export const userSearch = (name) => ({
    type: 'SCHEDULE_MEETING_USER_SEARCH_BY_NAME',
    payload: axios.get(`${process.env.API_ROOT}/api/users?name=${name}&type=${userTypes.tenant}`)
        .catch((e) => {
            toast.error('Something went wrong with the user search, please try again later');

            // Return the error so other handlers can use it
            return e;
        })
});

export const addParticipant = (user) => ({
    type: 'SCHEDULE_MEETING_ADD_PARTICIPANT',
    payload: user
});

export const removeParticipant = (user) => ({
    type: 'SCHEDULE_MEETING_REMOVE_PARTICIPANT',
    payload: user
});

export const clearLandlord = () => ({
    type: 'SCHEDULE_MEETING_CLEAR_LANDLORD'
});

export const landlordSearch = (name) => ({
    type: 'SCHEDULE_MEETING_LANDLORD_SEARCH_BY_NAME',
    payload: axios.get(`${process.env.API_ROOT}/api/users?name=${name}&type=${userTypes.landlord}`)
        .catch((e) => {
            toast.error('Something went wrong with the landlord search, please try again later');

            // Return the error so other handlers can use it
            return e;
        })
});

export const addLandlord = (landlord)  => ({
    type: 'SCHEDULE_MEETING_ADD_LANDLORD',
    payload: landlord
});

export const listingSearch = (landlordId, location) => ({
    type: 'SCHEDULE_MEETING_LISTING_SEARCH',
    payload: axios.get(`${process.env.API_ROOT}/api/listings`, {
        params: {
            location,
            ownerId: landlordId
        }
    })
        .catch((e) => {
            toast.error('Something went wrong with the listings search, please try again later');

            // Return the error so other handlers can use it
            return e;
        })
});

export const setListing = (listing) => ({
    type: 'SCHEDULE_MEETING_SET_LISTING',
    payload: listing
});

export const clearListing = () => ({
    type: 'SCHEDULE_MEETING_CLEAR_LISTING'
});
