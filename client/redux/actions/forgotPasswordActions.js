import axios from 'axios';

export const submitForm = (formData) => ({
    type: 'PASSWORD_RESET_EMAIL_FORM_SUBMITTED',
    payload: axios.post(`${process.env.API_ROOT}/api/passwordReset`, formData)
});

export const resendEmail = (email) => ({
    type: 'PASSWORD_RESET_EMAIL_FORM_RESEND_SUBMITTED',
    payload: axios.post(`${process.env.API_ROOT}/api/passwordReset/resend`, { email })
});

export const deleteEmail = () => ({
    type: 'PASSWORD_RESET_EMAIL_DELETE'
});
