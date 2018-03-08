const config = {};

const changePasswordReducer = (state = config, actions) => {
    const {
        type,
        payload
    } = actions;

    switch(type) {
        case 'CHANGE_PASSWORD_FORM_SUBMITTED': {
            state = {
                ...state,
                isProcessing: true,
                errorMessage: null
            }

            break;
        }
        case 'CHANGE_PASSWORD_FORM_SUBMITTED_FULFILLED': {
            state = {
                ...state,
                isProcessing: false
            }

            break;
        }
        case 'CHANGE_PASSWORD_FORM_SUBMITTED_REJECTED': {
            const {
                response: {
                    data: {
                        errorKey
                    } = {}
                } = {}
            } = payload;

            let errorMessage;

            if (errorKey) {
                const errorMessages = {
                    [process.env.PROFILE_EDIT_ERRORS_GENERIC]: 'Your password could not be updated.',
                    [process.env.PROFILE_EDIT_ERRORS_INCORRECT_PASSWORD]: 'Incorrect password'
                };

                errorMessage = errorMessages[errorKey];
            } else {
                errorMessage = 'Your password could not be updated.';
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

export default changePasswordReducer;
