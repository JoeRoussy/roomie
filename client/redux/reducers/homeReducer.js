import { cities } from '../../../common/constants';

const config = {
    recommendedRoommates: [],
    typedText: cities[0].value,
    typedTextIndex: 0
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
                    recommendedRoommates: [],
                    isLoadingRoommateSuggestions: false
                };
            }

            break;
        }

        case 'GET_NEXT_TYPED_TEXT': {
            let newIndex = ++state.typedTextIndex;

            if (newIndex === cities.length) {
                newIndex = 0;
            }

            state = {
                ...state,
                typedText: cities[newIndex].value,
                typedTextIndex: newIndex
            };
        }
    }

    return state;
}

export default homeReducer;
