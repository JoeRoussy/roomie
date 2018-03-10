import axios from 'axios';

export const setPasswordResetToken = (token) => ({
    type: 'SET_PASSWORD_RESET_TOKEN',
    payload: token
});

// TODO: We need to use handle authentication request here but we also need to redirect to the home page (which might already do this)
export const submitForm = (formData) => ({
    type: 'PASSWORD_RESET_PASSWORD_FORM_SUBMITTED',
    payload: axios.post(`${process.env.API_ROOT}/api/passwordReset/newPassword`, formData)
});
