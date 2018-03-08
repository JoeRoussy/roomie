import axios from 'axios';
import { toast } from 'react-toastify';
import { navigateTo as getNavigateTo } from '../../components';

export const submitForm = (formData) => (dispatch) => {
    const {
        _id: userId,
        oldPassword,
        newPassword
    } = formData;

    dispatch({
        type: 'CHANGE_PASSWORD_FORM_SUBMITTED'
    });

    // NOTE: The id of the user is snuck in as an inital value of the form
    axios.put(`${process.env.API_ROOT}/api/users/${userId}`, {
        oldPassword,
        password: newPassword
    })
        .then((res) => {
            toast.success('Your password has been updated');

            dispatch({
                type: 'CHANGE_PASSWORD_FORM_SUBMITTED_FULFILLED',
                payload: res
            });

            getNavigateTo(dispatch)('/');
        })
        .catch((e) => {
            dispatch({
                type: 'CHANGE_PASSWORD_FORM_SUBMITTED_REJECTED',
                payload: e
            });
        })
};
