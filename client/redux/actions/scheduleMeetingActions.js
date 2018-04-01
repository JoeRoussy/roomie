import axios from 'axios';
import qs from 'qs';
import { toast } from 'react-toastify';

import { userTypes } from '../../../common/constants';
import { navigateTo as getNavigateTo } from '../../components';

export const getAggregateSchedules = (participants) => ({
    type: 'SCHEDULE_MEETING_GET_AGGREGATE_SCHEDULES',
    payload: axios.get(`${process.env.API_ROOT}/api/schedule`, {
        params: {
            participants: participants.map(x => x.api_response._id)
        },
        paramsSerializer: (params) => qs.stringify(params, {arrayFormat: 'repeat'})
    })
});

// Helper action to dispatch all the needed actions to reset the state of the
export const reset = (dispatch) => {
    dispatch(setStep(1));
    dispatch(clearListing());
    dispatch(clearLandlord());
    dispatch(clearParticipants());
};

export const setStep = (step) => ({
    type: 'SCHEDULE_MEETING_SET_STEP',
    payload: step
});

export const nextStep = () => ({
    type: 'SCHEDULE_MEETING_NEXT_STEP'
});

export const previousStep = () => ({
    type: 'SCHEDULE_MEETING_PREVIOUS_STEP'
});

export const userSearch = (name) => ({
    type: 'SCHEDULE_MEETING_USER_SEARCH_BY_NAME',
    payload: axios.get(`${process.env.API_ROOT}/api/users`, {
        params: {
            name,
            type: userTypes.tenant,
            excludeSelf: true
        }
    })
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

export const clearParticipants = () => ({
    type: 'SCHEDULE_MEETING_CLEAR_PARTICIPANTS'
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

export const setLandlordSearchValue = (value) => ({
    type: 'SCHEDULE_MEETING_SET_LANDLORD_SEARCH_VALUE',
    payload: value
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

export const submitMeetingForm = (formData) => (dispatch) => {
    dispatch({
        type: 'SCHEDULE_MEETING_FORM_SUBMITTED'
    });

    const {
        participants,
        listing,
        ...rest
    } = formData;

    axios.post(`${process.env.API_ROOT}/api/schedule/meeting`, {
        participants: participants.map(x => x.api_response._id),
        listing: listing.api_response._id,
        ...rest
    })
        .then((res) => {
            toast.success('Your meeting has been created!');
            getNavigateTo(dispatch)('/');

            dispatch({
                type: 'SCHEDULE_MEETING_FORM_SUBMITTED_SUCCESS',
                payload: res
            });
            dispatch(reset);
        })
        .catch((e) => {
            dispatch({
                type: 'SCHEDULE_MEETING_FORM_SUBMITTED_REJECTED',
                payload: e
            });
        });
};
