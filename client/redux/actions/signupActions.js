import axios from 'axios';
import jwtDecode from 'jwt-decode';

import { setCurrentUser } from './userActions';
import { setAuthorizationToken } from '../store';

export const chooseUserType = (type) => ({
    type: 'USER_TYPE_CHOSEN',
    payload: {
        type
    }
});

// Here we need to dispatch our own actions based on promise outcome becuase we need to mutate local storage
// if we get a token back. For consistencty, the fulfilled and rejected actions are still dispatched as the promise middleware
// would have done.
export const submitForm = (formData, userType) => (dispatch) => {
    dispatch({
        type: 'SIGN_UP_FORM_SUBMITTED'
    });

    return axios.post(`${process.env.API_ROOT}/api/users`, {
            userType,
            ...formData
        })
            .then(res => {
                const {
                    data: {
                        token
                    } = {}
                } = res;

                localStorage.setItem('jwtToken', token);
                setAuthorizationToken(token);

                dispatch(setCurrentUser(jwtDecode(token)));
                dispatch({
                    type: 'SIGN_UP_FORM_SUBMITTED_FULFILLED',
                    payload: res
                });
                console.log('Got to the end of the res function');
            })
            .catch((e) => {
                console.error(e);
                dispatch({
                    type: 'SIGN_UP_FORM_SUBMITTED_REJECTED',
                    payload: e
                });
            });
};
