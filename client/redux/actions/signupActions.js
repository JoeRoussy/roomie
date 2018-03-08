import axios from 'axios';
import { handleUserUpdateRequest, buildFormSubmissionData } from '../components';

export const chooseUserType = (type) => ({
    type: 'USER_TYPE_CHOSEN',
    payload: {
        type
    }
});

export const submitForm = (formData, userType) => (dispatch) => {
    const submissionData = buildFormSubmissionData(formData, [ 'profilePic' ]);

    submissionData.append('userType', userType);

    // This function abstracts the handling of a sign up or a sign in as they are both have the same side effects based on the result of the
    // promise. In addition to the appropriate side effects, it will dispatch the given action in addition to a _REJECTED and a _FULFILLED
    // action as the promise middleware does.
    return handleUserUpdateRequest({
        promise: axios.post(`${process.env.API_ROOT}/api/users`, submissionData),
        submitActionName: 'SIGN_UP_FORM_SUBMIT',
        dispatch,
        successToast: 'Welcome to Roomie!'
    });
};
