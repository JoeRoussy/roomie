const config = {
    participants: [],
    aggregatedEvents: [],
    isLoading: false,
    isUserSearchLoading: false,
    userSearchResults: []
    step: 1
}

const scheduleMeetingReducer = (state = config, actions) => {
    const {
        payload,
        type
    } = actions;

    switch(type) {
        case 'SCHEDULE_MEETING_PREVIOUS_STEP': {
            state = {
                ...state,
                step: state.step + 1
            };

            break;
        }
        case 'SCHEDULE_MEETING_PREVIOUS_STEP': {
            state = {
                ...state,
                step: state.step - 1
            };

            break;
        }

        case 'USER_SEARCH_BY_NAME': {
            state = {
                ...state,
                isUserSearchLoading: true,
                userSearchResults: []
            };

            break;
        }

        case 'USER_SEARCH_BY_NAME_FULFILLED': {
            const {
                data: {
                    users
                } = {}
            } = payload;

            // Put things in the shape expected by the UserSearch component
            userSearchResults = users.map(user => ({
                title: user.name,
                image: `${process.env.ASSETS_ROOT}${user.profilePictureLink}`,
                description: isLandlord ? 'Landlord' : 'Tenant'
            }));

            state = {
                ...state,
                isUserSearchLoading: false,
                userSearchResults
            };

            break;
        }

        case 'USER_SEARCH_BY_NAME_REJECTED': {
            state = {
                ...state,
                isUserSearchLoading: false,
                userSearchResults: []
            };

            break;
        }
    }
    return state;
}

export default scheduleMeetingReducer;
