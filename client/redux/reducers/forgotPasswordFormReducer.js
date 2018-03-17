const config = {
    token: null
};

const forgotPasswordFormReducer = (state = config, actions) => {
    const {
        type,
        payload
    } = actions;

    switch (type) {
        case 'SET_PASSWORD_RESET_TOKEN': {
            state = {
                ...state,
                token: payload
            };

            break;
        }

        case 'PASSWORD_RESET_PASSWORD_FORM_SUBMITTED_PENDING': {
            state = {
                ...state,
                isProcessing: true,
                errorMessage: null
            };

            break;
        }

        case 'PASSWORD_RESET_PASSWORD_FORM_SUBMITTED_FULFILLED': {
            state = {
                ...state,
                isProcessing: false,
                token: null
            }

            break;
        }

        case 'PASSWORD_RESET_PASSWORD_FORM_SUBMITTED_REJECTED': {
            const {
                response: {
                    data: {
                        errorKey
                    } = {}
                } = {}
            } = payload;

            let errorMessage = 'There was an error processing your request.';

            if (errorKey === process.env.PASSWORD_RESET_ERRORS_INVALID_TOKEN) {
                errorMessage = 'It looks like you are using an old password resert link. If you do not know your password, click the Forgot Password button on the log in page.'
            }

            state = {
                ...state,
                isProcessing: false,
                errorMessage
            };

            break;
        }
    }

    return state;
}

export default forgotPasswordFormReducer;
