import axios from 'axios';
import { handleAuthenticationRequest } from '../components';

export const submitForm = (formData) => (dispatch) => (handleAuthenticationRequest({
    promise: axios.post(`${process.env.API_ROOT}/login`, {
        ...formData
    }),
    submitActionName: 'SIGN_IN_FORM_SUBMIT',
    dispatch
}));
