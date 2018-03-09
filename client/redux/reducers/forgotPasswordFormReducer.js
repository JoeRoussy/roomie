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

        case 'PASSWORD_RESET_FORM_SUBMITTED': {
            state = {
                ...state,
                isProcessing: true
            };

            break;
        }

        case 'PASSWORD_RESET_FORM_SUBMITTED_FULFILLED': {
            state = {
                ...state,
                isProcessing: false,
                token: null
            }

            break;
        }

        case 'PASSWORD_RESET_FORM_SUBMITTED_REJECTED': {
            state = {
                ...state,
                isProcessing: false
            };

            break;
        }
    }

    return state;
}

export default forgotPasswordFormReducer;
