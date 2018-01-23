const config = {
    // user: {
    //     name: 'Joe',
    //     email: 'joeroussy@gmail.com'
    // }
};

function handlePayloadWithUser(state, payload) {
    const {
        data: {
            user
        } = {}
    } = payload;

    return {
        ...state,
        user
    };
}

const userReducer = (state = config, actions) => {
    const {
        type,
        payload
    } = actions;

    switch (type) {
        case 'SIGN_UP_FORM_SUBMITTED_FULFILLED': {
            state = handlePayloadWithUser(state, payload);

            break;
        }
        case 'GET_CURRENT_USER_FULFILLED': {
            state = handlePayloadWithUser(state, payload);

            break;
        }
    }

    return state;
}

export default userReducer;
