const config = {
    listing: null,
    participants: [],
    aggregatedEvents: [],
    isLoading: false,
    isUserSearchLoading: false,
    userSearchResults: [],
    landlordSearchResults: [],
    landlordSearchValue: '',
    isLandlordSearchLoading: false,
    isListingSearchLoading: false,
    listingSearchResults: [],
    step: 1
}

// NOTE: islandlord needs to be lowercase because it is not a normal dom element
const mapUserForSearchResults = (user) => ({
    title: user.name,
    image: `${process.env.ASSETS_ROOT}${user.profilePictureLink}`,
    islandlord: user.isLandlord ? 'true' : 'false',
    api_response: user
});

const scheduleMeetingReducer = (state = config, actions) => {
    const {
        payload,
        type
    } = actions;

    switch(type) {
        case 'SCHEDULE_MEETING_NEXT_STEP': {
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

        case 'SCHEDULE_MEETING_USER_SEARCH_BY_NAME_PENDING': {
            state = {
                ...state,
                isUserSearchLoading: true,
                userSearchResults: []
            };

            break;
        }

        case 'SCHEDULE_MEETING_USER_SEARCH_BY_NAME_FULFILLED': {
            const {
                data: {
                    users
                } = {}
            } = payload;

            state = {
                ...state,
                isUserSearchLoading: false,
                userSearchResults: users.map(mapUserForSearchResults)
            };

            break;
        }

        case 'SCHEDULE_MEETING_USER_SEARCH_BY_NAME_REJECTED': {
            state = {
                ...state,
                isUserSearchLoading: false,
                userSearchResults: []
            };

            break;
        }

        case 'SCHEDULE_MEETING_ADD_PARTICIPANT': {
            const newParticipants = state.participants;
            newParticipants.push(payload);

            state = {
                ...state,
                participants: [ ...newParticipants ]
            };

            break;
        }

        case 'SCHEDULE_MEETING_ADD_LANDLORD': {
            const newParticipants = state.participants;
            newParticipants.push(payload);

            state = {
                ...state,
                participants: [ ...newParticipants ],
                invitedLandlord: payload
            };

            break;
        }

        case 'SCHEDULE_MEETING_REMOVE_PARTICIPANT': {
            const {
                _id
            } = payload;

            const newParticipants = state.participants.filter(x => x.api_response._id !== _id);

            state = {
                ...state,
                participants: [ ...newParticipants ]
            };

            break;
        }

        case 'SCHEDULE_MEETING_CLEAR_LANDLORD': {
            const newParticipants = state.participants.filter(x => x.islandlord !== 'true');

            state = {
                ...state,
                participants: [ ...newParticipants ],
                invitedLandlord: undefined
            };
        }

        case 'SCHEDULE_MEETING_LANDLORD_SEARCH_BY_NAME_PENDING': {
            state = {
                ...state,
                isLandlordSearchLoading: true,
                landlordSearchResults: []
            };

            break;
        }

        case 'SCHEDULE_MEETING_LANDLORD_SEARCH_BY_NAME_FULFILLED': {
            const {
                data: {
                    users
                } = {}
            } = payload;

            state = {
                ...state,
                isLandlordSearchLoading: false,
                landlordSearchResults: users.map(mapUserForSearchResults)
            };

            break;
        }

        case 'SCHEDULE_MEETING_LANDLORD_SEARCH_BY_NAME_REJECTED': {
            state = {
                ...state,
                isLandlordSearchLoading: false,
                landlordSearchResults: []
            };

            break;
        }

        case 'SCHEDULE_MEETING_LISTING_SEARCH_PENDING': {
            state = {
                ...state,
                isListingSearchLoading: true,
                listingSearchResults: []
            };

            break;
        }

        case 'SCHEDULE_MEETING_LISTING_SEARCH_FULFILLED': {
            const {
                data: {
                    listings
                } = {}
            } = payload;

            state = {
                ...state,
                isListingSearchLoading: false,
                listingSearchResults: listings.map(listing => ({
                    title: listing.name,
                    image: `${process.env.ASSETS_ROOT}${listing.images[0]}`,
                    description: listing.description,
                    price: `$${listing.price}`,
                    api_response: listing
                }))
            };

            break;
        }

        case 'SCHEDULE_MEETING_LISTING_SEARCH_REJECTED': {
            state = {
                ...state,
                isListingSearchLoading: false,
                listingSearchResults: []
            };

            break;
        }

        case 'SCHEDULE_MEETING_SET_LISTING': {
            state = {
                ...state,
                listing: payload
            };

            break;
        }

        case 'SCHEDULE_MEETING_CLEAR_LISTING': {
            state = {
                ...state,
                listing: null
            };

            break;
        }
    }

    return state;
}

export default scheduleMeetingReducer;
