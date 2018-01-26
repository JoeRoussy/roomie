import axios from 'axios';


export const submitForm = ({
    email,
    password
}) => ({
    type: 'SIGN_UP_FORM_SUBMITED',
    payload: axios.post(`${process.env.API_ROOT}/login`, {
        email,
        password
    })
});
