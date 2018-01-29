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
export const submitForm = (formData, userType) => (dispatch) => {
    const submissionData = new FormData();

    Object.keys(formData).forEach(key => {
        if (key === 'profilePic') {
            submissionData.append('profilePic', formData[key][0])
        } else {
            submissionData.append(key, formData[key]);
        }
    });

    submissionData.append('userType', userType);

    return handleAuthenticationRequest({
        promise: axios.post(`${process.env.API_ROOT}/api/users`, submissionData),
        submitActionName: 'SIGN_IN_FORM_SUBMIT',
        dispatch
    });
};
