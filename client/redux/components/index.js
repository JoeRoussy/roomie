/*
    This is a collection of useful functions for usage relating to redux
*/

import jwtDecode from 'jwt-decode';
import { toast } from 'react-toastify';

import { setJwt } from '../../components';
import { setCurrentUser } from '../actions/userActions';

// Since our workflow is the same for handling login and signup responses, we pulled this functionality out and abstracted out
// the actual requests.
// Here we need to dispatch our own actions based on promise outcome becuase we need to mutate local storage
// if we get a token back. For consistencty, the fulfilled and rejected actions are still dispatched as the promise middleware
// would have done.
export const handleUserUpdateRequest = ({
    promise,
    submitActionName,
    dispatch,
    successToast,
    errorToast,
    autoClose = true
}) => {
    dispatch({
        type: submitActionName
    });

    promise
        .then(res => {
            const {
                data: {
                    token
                } = {}
            } = res;

            if (successToast) {
                toast.success(successToast, {
                    autoClose
                });
            }

            const currentUser = token ? jwtDecode(token) : null;

            setJwt(token);

            dispatch(setCurrentUser(currentUser));
            dispatch({
                type: `${submitActionName}_FULFILLED`,
                payload: res
            });
        })
        .catch(e => {
            if (errorToast) {
                toast.error(errorToast, {
                    autoClose
                });
            }

            dispatch({
                type: `${submitActionName}_REJECTED`,
                payload: e
            });
        });
}

// Takes formData as json and keys containing image data and builds form submission data for it
export const buildFormSubmissionData = (formData, imageFileNames) => {
    const submissionData = new FormData();

    Object.keys(formData).forEach((key) => {
        if (imageFileNames.includes(key)) {
            if (Array.isArray(formData[key])) {
                formData[key].forEach((image) => submissionData.append(key, image));
            } else {
                // In this case, the form field has just one image, but does not have a 'forEach' method
                submissionData.append(key, formData[key][0]);
            }
        } else {
            submissionData.append(key, formData[key]);
        }
    });

    return submissionData;
}
