const config = {
    email: null
};

const forgotPasswordReducer = (state = config, actions) => {
    const {
        type,
        payload
    } = actions;

    switch (type) {

        case 'PASSWORD_RESET_EMAIL_FORM_SUBMITTED': {
            state = {
                ...state,
                isProcessing: true
            };

            break;
        }

        case 'PASSWORD_RESET_EMAIL_FORM_SUBMITTED_FULFILLED': {
            state = {
                ...state,
                isProcessing: false,
                email: payload
            };

            break;
        }

        case 'PASSWORD_RESET_EMAIL_FORM_SUBMITTED_REJECTED': {
            // TODO: Process error message

            state = {
                ...state,
                isProcessing: false
            };

            break;
        }

        case 'PASSWORD_RESET_EMAIL_DELETE': {
            state = {
                ...state,
                email: null
            };

            break;
        }
    }

    return state;
}

export default forgotPasswordReducer;
