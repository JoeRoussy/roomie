import axios from 'axios';

export const chooseUserType = (type) => ({
    type: 'USER_TYPE_CHOSEN',
    payload: {
        type
    }
});

export const submitForm = (formData) => ({
    type: 'SIGN_UP_FORM_SUBMITTED',
    payload: axios.post(`${process.env.API_ROOT}/api/users`, formData)
});
