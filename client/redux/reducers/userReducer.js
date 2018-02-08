const config = {

};

const userReducer = (state = config, actions) => {
    const {
        type,
        payload
    } = actions;

    switch (type) {
        case 'SET_CURRENT_USER': {
            state = {
                ...state,
                user: payload.user
            };

            break;
        }

        case 'PROFILE_FORM_SUBMIT_FULFILLED': {
            const {
                data: {
                    user
                } = {}
            } = payload;

            state = {
                ...state,
                user
            };

            break;
        }
    }

    return state;
}

export default userReducer;
