import axios from 'axios';
import { toast } from 'react-toastify';
import jwtDecode from 'jwt-decode';

import { setJwt } from '../../components';
import { handleAuthenticationRequest, buildFormSubmissionData } from '../components';
import { setCurrentUser } from './userActions';


// Take care of our own dispatches based on promise result so we can dispatch setCurrentUser (with
// the user if we get one from the server)
export const submitForm = (formData) => (dispatch) => {
    const submissionData = buildFormSubmissionData(formData, [ 'profilePic' ]);

    dispatch({
        type: 'PROFILE_FORM_SUBMIT_PENDING'
    });

    // TODO: Use handleAuthenticationRequest here
    axios.put(`${process.env.API_ROOT}/api/users/${formData._id}`, submissionData)
        .then((res) => {
            const {
                data: {
                    token
                } = {}
            } = res;

            // The value of the user has changed so we should save a new token
            setJwt(token);
            toast.success('Your profile has been updated');

            // Also need to set the user based on the token
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

export const deleteProfile = () => ({
    type: 'DELETE_PROFILE_SELECTED'
});

export const cancelDeleteProfile = () => ({
    type: 'DELETE_PROFILE_CANCELED'
});

// Take care of our own dispatches based on promise result so we can dispatch setCurrentUser (with null)
// export const confirmDeleteProfile = (dispatch) => {
//     dispatch({
//         type: 'DELETE_PROFILE_CONFIRMED'
//     });
//
//     axios.delete(`${process.env.API_ROOT}/api/users/me`)
//         .then((res) => {
//             toast.success('Your profile has been deleted');
//             setJwt(null);
//             dispatch(setCurrentUser(null));
//
//             dispatch({
//                 type: 'DELETE_PROFILE_CONFIRMED_FULFILLED',
//                 payload: res
//             });
//         })
//         .catch((e) => {
//             toast.error('Could not delete profile. Please try again later.');
//
//             dispatch({
//                 type: 'DELETE_PROFILE_CONFIRMED_REJECTED',
//                 payload: e
//             });
//         });
// };

export const confirmDeleteProfile = (dispatch) => (handleAuthenticationRequest({
    dispatch,
    promise: axios.delete(`${process.env.API_ROOT}/api/users/me`),
    submitActionName: 'DELETE_PROFILE_CONFIRMED',
    successToast: 'Your profile has been deleted',
    errorToast: 'Could not delete profile. Please try again later.'
}));
