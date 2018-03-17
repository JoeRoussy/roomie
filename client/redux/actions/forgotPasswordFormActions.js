import axios from 'axios';
import { handleUserUpdateRequest } from '../components';

export const setPasswordResetToken = (token) => ({
    type: 'SET_PASSWORD_RESET_TOKEN',
    payload: token
});

export const submitForm = (formData) => (dispatch) => (handleUserUpdateRequest({
    promise: axios.post(`${process.env.API_ROOT}/api/passwordReset/newPassword`, formData),
    submitActionName: 'PASSWORD_RESET_PASSWORD_FORM_SUBMITTED',
    dispatch,
    successToast: 'Your password has been reset. Welcome back!'
}));
