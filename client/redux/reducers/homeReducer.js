const config = {
    recommendedRoommates: [],
};

const homeReducer = (state = config, actions) => {
    const {
        type,
        payload
    } = actions;

    switch(type) {
        case 'GET_ROOMMATE_SUGGESTIONS_PENDING': {
            state = {
                ...state,
                isLoadingRoommateSuggestions: true
            };

            console.log('The get roommate suggestions is pending');

            break;
        }

        case 'GET_ROOMMATE_SUGGESTIONS_FULFILLED': {
            const {
                data: {
                    recommendedRoommates
                } = {}
            } = payload;

            console.log('The get roommate suggestions has fulfilled');

            state = {
                ...state,
                isLoadingRoommateSuggestions: false,
                recommendedRoommates
            };

            break;
        }

        case 'GET_ROOMMATE_SUGGESTIONS_REJECTED': {
            state = {
                ...state,
                isLoadingRoommateSuggestions: false
            };

            console.log('The get roommate suggestions has failed');

            break;
        }
    }

    return state;
}

export default homeReducer;
