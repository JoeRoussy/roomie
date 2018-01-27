const config = {

};

const signInReducer = (state = config, actions) => {
    const {
        type: actionType,
        payload
    } = actions;

    switch (actionType) {
        case 'SIGN_IN_FORM_SUBMIT': {
            state = {
                ...state,
                isFormProcessing: true,
                errorMessage: null
            };

            break;
        }
        case 'SIGN_IN_FORM_SUBMIT_FULFILLED': {
            const {
                data: {
                    token
                } = {}
            } = res;

            state = {
                ...state,
                isFormProcessing: false
            };

            break;
        }
        case 'SIGN_IN_FORM_SUBMIT_REJECTED': {
            const {
                data: {
                    errorKey
                } = {}
            } = payload;

            // Set the error message based on the key returned by the server.
            const errorMessages = {
                [process.env.SIGNIN_ERRORS_MISSING_VALUES]: 'Please make sure you provide a user name and a password',
                [process.env.SIGNIN_ERRORS_GENERIC]: 'Your request could not be processed',
                [process.env.SIGNIN_ERRORS_INVALID_CREDENTIALS]: 'Invalid credentials'
            };

            state = {
                ...state,
                isFormProcessing: false,
                errorMessage: errorMessages[errorKey]
            }
            break;
        }

    }


    return state;
}

export default signInReducer;
