import axios from 'axios';
import { handleAuthenticationRequest } from '../components';

export const chooseUserType = (type) => ({
    type: 'USER_TYPE_CHOSEN',
    payload: {
        type
    }
});

// Here we need to dispatch our own actions based on promise outcome becuase we need to mutate local storage
// if we get a token back. For consistencty, the fulfilled and rejected actions are still dispatched as the promise middleware
// would have done.
export const submitForm = (formData, userType) => (dispatch) => (handleAuthenticationRequest({
    promise: axios.post(`${process.env.API_ROOT}/api/users`, {
        userType,
        ...formData
    }),
    submitActionName: 'SIGN_UP_FORM_SUBMIT',
    dispatch
}));
