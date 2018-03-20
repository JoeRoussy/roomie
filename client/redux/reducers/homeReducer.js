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

            break;
        }

        case 'GET_ROOMMATE_SUGGESTIONS_FULFILLED': {
            const {
                data: {
                    recommendedRoommates
                } = {}
            } = payload;

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

            break;
        }

        case 'SET_CURRENT_USER': {
            const {
                user
            } = payload;

            // If there is not user, clear out the recommendedRoommates
            if (!user) {
                state = {
                    ...state,
                    recommendedRoommates: []
                };
            }

            break;
        }
    }

    return state;
}

export default homeReducer;
