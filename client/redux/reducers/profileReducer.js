const config = {

};

const profileReducer = (state = config, actions) => {
    const {
        type,
        payload
    } = actions;

    switch (type) {
        case 'PROFILE_FORM_SUBMIT_PENDING': {
            state = {
                ...state,
                isFormProcessing: true,
                errorMessage: null
            };

            break;
        }
        case 'PROFILE_FORM_SUBMIT_FULFILLED': {
            state = {
                ...state,
                isFormProcessing: false
            };

            break;
        }
        case 'PROFILE_FORM_SUBMIT_REJECTED': {
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
                    [process.env.PROFILE_EDIT_ERRORS_GENERIC]: 'Your profile could not be updated.',
                    [process.env.PROFILE_EDIT_ERRORS_DUPLICATE_EMAIL]: 'A user with that email already exists'
                };

                errorMessage = errorMessages[errorKey];
            } else {
                errorMessage = 'Your profile could not be updated.';
            }

            state = {
                ...state,
                isFormProcessing: false,
                errorMessage
            };

            break;
        }
    }

    return state;
}

export default profileReducer;
