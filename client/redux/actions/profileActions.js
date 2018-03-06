import axios from 'axios';
import { toast } from 'react-toastify';
import jwtDecode from 'jwt-decode';

import { setJwt } from '../../components';
import { handleUserUpdateRequest, buildFormSubmissionData } from '../components';
import { setCurrentUser } from './userActions';


export const submitForm = (formData) => (dispatch) => {
    const submissionData = buildFormSubmissionData(formData, [ 'profilePic' ]);

    return handleUserUpdateRequest({
        dispatch,
        promise: axios.put(`${process.env.API_ROOT}/api/users/${formData._id}`, submissionData),
        submitActionName: 'PROFILE_FORM_SUBMIT',
        successToast: 'Your profile has been updated',
        errorToast: 'Your profile could not be updated. Please try again later.',
        autoClose: true
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

export const confirmDeleteProfile = (dispatch) => (handleUserUpdateRequest({
    dispatch,
    promise: axios.delete(`${process.env.API_ROOT}/api/users/me`),
    submitActionName: 'DELETE_PROFILE_CONFIRMED',
    successToast: 'Your profile has been deleted',
    errorToast: 'Could not delete profile. Please try again later.'
}));
