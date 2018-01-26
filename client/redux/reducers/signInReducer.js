const config = {

};

const signInReducer = (state = config, actions) => {
    const {
        type: actionType,
        payload
    } = actions;

    switch (actionType) {
        case 'SIGN_UP_FORM_SUBMITED_PENDING': {
            console.log('Making the pending state true');
            state = {
                ...state,
                isFormProcessing: true,
                errorMessage: null
            };

            break;
        }
        case 'SIGN_UP_FORM_SUBMITED_FULFILLED': {
            const {
                data: {
                    token
                } = {}
            } = res;

            localStorage.setItem('jwtToken', token);
            setAuthorizationToken(token);

            state = {
                ...state,
                isFormProcessing: false
            };

            break;
        }
        case 'SIGN_UP_FORM_SUBMITED_REJECTED': {
            // TODO: Take loading state away and show error
            state = {
                ...state,
                isFormProcessing: false,
                errorMessage: 'things did not go well....'
            }
            break;
        }

    }


    return state;
}

export default signInReducer;
