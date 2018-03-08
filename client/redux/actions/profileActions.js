import axios from 'axios';
import { toast } from 'react-toastify';
import jwtDecode from 'jwt-decode';

import { setJwt } from '../../components';
import { buildFormSubmissionData } from '../components';
import { setCurrentUser } from './userActions';


export const submitForm = (formData) => (dispatch) => {
    const submissionData = buildFormSubmissionData(formData, [ 'profilePic' ]);

    dispatch({
        type: 'PROFILE_FORM_SUBMIT_PENDING'
    });

    // NOTE: The id of the user is snuck in as an inital value of the form
    axios.put(`${process.env.API_ROOT}/api/users/${formData._id}`, submissionData)
        .then((res) => {
            const {
                data: {
                    token
                } = {}
            } = res;

            // The value of the user has changed so we should save a new token
            // NOTE: The user reducer will take care of setting the new value of the user in the state
            setJwt(token);

            // Use a toast to notify the user that their submission was successful
            toast.success('Your profile has been updated');

            dispatch(setCurrentUser(jwtDecode(token)));
            dispatch({
                type: 'PROFILE_FORM_SUBMIT_FULFILLED',
                payload: res
            });

            // We must return the res object so it can be used by other fulfilled handlers (in reducers for example)
            return res;
        })
        .catch((e) => {
            dispatch({
                type: 'PROFILE_FORM_SUBMIT_REJECTED',
                payload: e
            });
        });
};

export const editProfile = () => ({
    type: 'EDIT_PROFILE_SELECTED'
});

export const cancelEditProfile = () => ({
    type: 'EDIT_PROFILE_CANCELLED'
});

export const editProfilePicture = () => ({
    type: 'EDIT_PROFILE_PICTURE_SELECTED'
});

export const cancelEditProfilePicture = () => ({
    type: 'EDIT_PROFILE_PICTURE_CANCELLED'
});
