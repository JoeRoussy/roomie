import axios from 'axios';
import { handleUserUpdateRequest } from '../components';

export const setPasswordResetToken = (token) => ({
    type: 'SET_PASSWORD_RESET_TOKEN',
    payload: token
});

// TODO: We need to use handle authentication request here but we also need to redirect to the home page (which might already do this)
// export const submitForm = (formData) => ({
//     type: 'PASSWORD_RESET_PASSWORD_FORM_SUBMITTED',
//     payload: axios.post(`${process.env.API_ROOT}/api/passwordReset/newPassword`, formData)
// });

export const submitForm = (formData) => (dispatch) => (handleUserUpdateRequest({
    promise: axios.post(`${process.env.API_ROOT}/api/passwordReset/newPassword`, formData),
    submitActionName: 'PASSWORD_RESET_PASSWORD_FORM_SUBMITTED',
    dispatch,
    successToast: 'Your password has been reset. Welcome back!'
}));
