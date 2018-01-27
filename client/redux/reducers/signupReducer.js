const config = {

};

const signUpReducer = (state = config, actions) => {
    const {
        type: actionType,
        payload
    } = actions;

    switch (actionType) {
        case 'USER_TYPE_CHOSEN': {
            const {
                type
            } = payload;

            state = {
                ...state,
                userType: type
            }

            break;
        }
        case 'SIGN_UP_FORM_SUBMIT': {
            state = {
                ...state,
                isFormProcessing: true,
                errorMessage: null
            }

            break;
        }
        case 'SIGN_UP_FORM_SUBMIT_FULFILLED': {
            state = {
                ...state,
                isFormProcessing: false
            };

            break;
        }
        case 'SIGN_UP_FORM_SUBMIT_REJECTED': {
            const {
                data: {
                    errorKey
                } = {}
            } = payload;

            // Set the error message based on the key returned by the server.
            const errorMessages = {
                [process.env.SIGNUP_ERRORS_EXISTING_EMAIL]: 'A user with that email already exists',
                [process.env.SIGNUP_ERRORS_GENERIC]: 'Your request could not be processed',
                [process.env.SIGNUP_ERRORS_MISSING_VALUES]: 'Please ensure you have filled all the fields in the form'
            }

            state = {
                ...state,
                isFormProcessing: false,
                errorMessage: errorMessages[errorKey] || ''
            };

            break;
        }
    }


    return state;
}

export default signUpReducer;
