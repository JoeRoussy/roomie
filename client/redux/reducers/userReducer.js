const config = {
    // user: {
    //     name: 'Joe',
    //     email: 'joeroussy@gmail.com'
    // }
};

const userReducer = (state = config, actions) => {
    const {
        type,
        payload
    } = actions;

    switch (type) {
        case 'SIGN_UP_FORM_SUBMITTED_FULFILLED': {
            const {
                data: {
                    user
                } = {}
            } = payload;

            state = {
                ...state,
                user
            }

            break;
        }
    }

    return state;
}

export default userReducer;
