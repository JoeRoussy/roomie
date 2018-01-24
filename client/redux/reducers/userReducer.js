const config = {

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
        case 'SET_CURRENT_USER': {
            state = {
                ...state,
                user: payload.user
            };

            break;
        }
    }

    return state;
}

export default userReducer;
