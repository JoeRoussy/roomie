import axios from 'axios';
import { handleUserUpdateRequest } from '../components';

export const submitForm = (formData) => (dispatch) => (handleUserUpdateRequest({
    promise: axios.post(`${process.env.API_ROOT}/login`, {
        ...formData
    }),
    submitActionName: 'SIGN_IN_FORM_SUBMIT',
    dispatch
}));
