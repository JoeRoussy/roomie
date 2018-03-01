const config = {
    errorMessage: null
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
            } = payload;

            state = {
                ...state,
                isFormProcessing: false
            };

            break;
        }
        case 'SIGN_IN_FORM_SUBMIT_REJECTED': {
            const {
                response: {
                    data: {
                        errorKey
                    } = {}
                } = {}
            } = payload;

            let errorMessage;

            if (errorKey) {
                // We got an error key back so use an error message that relates to it
                const errorMessages = {
                    [process.env.SIGNIN_ERRORS_MISSING_VALUES]: 'Please make sure you provide a user name and a password',
                    [process.env.SIGNIN_ERRORS_GENERIC]: 'Your request could not be processed',
                    [process.env.SIGNIN_ERRORS_INVALID_CREDENTIALS]: 'Invalid credentials'
                };

                errorMessage = errorMessages[errorKey];

            } else {
                // We did not get an error key back so use a generic error
                errorMessage = 'Your request could not be processed'
            }

            state = {
                ...state,
                isFormProcessing: false,
                errorMessage
            }

            break;
        }

    }

    return state;
}

export default signInReducer;
