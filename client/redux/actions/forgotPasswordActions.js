import axios from 'axios';

export const submitForm = (formData) => (dispatch) => {
    // TODO: Back end should return the validation object containing the email so we can use the normal middleware
    const {
        email
    } = formData;

    dispatch({
        type: 'PASSWORD_RESET_EMAIL_FORM_SUBMITTED'
    });

    axios.post(`${process.env.API_ROOT}/api/passwordReset`, formData)
        .then((res) => {
            // Pass the email in the payload so we can remember we sent the email to it
            dispatch({
                type: 'PASSWORD_RESET_EMAIL_FORM_SUBMITTED_FULFILLED',
                payload: email
            })
        })
        .catch((e) => {
            dispatch({
                type: 'PASSWORD_RESET_EMAIL_FORM_SUBMITTED_REJECTED',
                payload: e
            });
        });
};

export const resendEmail = (email) => ({
    type: 'PASSWORD_RESET_EMAIL_FORM_RESEND_SUBMITTED',
    payload: axios.post(`${process.env.API_ROOT}/api/passwordReset/resend`, { email })
});

export const deleteEmail = () => ({
    type: 'PASSWORD_RESET_EMAIL_DELETE'
});
