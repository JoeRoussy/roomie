const config = {

};

const signupReducer = (state = config, actions) => {
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
        case 'SIGN_UP_FORM_SUBMITTED': {
            state = {
                ...state,
                isFormProcessing: true
            }

            break;
        }
        case 'SIGN_UP_FORM_SUBMITTED_FULFILLED': {
            // NOTE: User reducer will handle bringing the user value into the state
            state = {
                ...state,
                isFormProcessing: false
            };

            break;
        }
        case 'SIGN_UP_FORM_SUBMITTED_REJECTED': {
            state = {
                ...state,
                isFormProcessing: false
            };

            break;
        }
    }


    return state;
}

export default signupReducer;
