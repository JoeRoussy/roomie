const config = {
    listing: null,
    participants: [],
    aggregatedEvents: [],
    isMeetingFormLoading: false,
    isUserSearchLoading: false,
    isCalendarViewLoading: false,
    events: [],
    userSearchResults: [],
    userSearchValue: '',
    landlordSearchResults: [],
    landlordSearchValue: '',
    isLandlordSearchLoading: false,
    isListingSearchLoading: false,
    listingSearchResults: [],
    listingSearchValue: '',
    step: 1,
    meetingFormErrorMessage: null
};

const truncate = (str) => {
    const maxLength = 150;

    if (str.length <= maxLength) {
        return str;
    }

    return `${str.substring(0, maxLength)}...`;
}

// NOTE: islandlord needs to be lowercase because it is not a normal dom element
const mapUserForSearchResults = (user) => ({
    title: user.name,
    image: `${process.env.ASSETS_ROOT}${user.profilePictureLink}`,
    islandlord: user.isLandlord ? 'true' : 'false',
    api_response: user
});

const mapListingForSearchResults = (listing) => ({
    title: listing.name,
    image: `${process.env.ASSETS_ROOT}${listing.images[0]}`,
    description: truncate(listing.description),
    price: `$${listing.price}`,
    api_response: listing
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

        case 'SCHEDULE_MEETING_SET_STEP': {
            state = {
                ...state,
                step: payload
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

            // Filter out the current participants from the search result
            const searchResults = users
                    .filter((user) => !state.participants.some(x => x.api_response._id === user._id))
                    .map(mapUserForSearchResults)

            state = {
                ...state,
                isUserSearchLoading: false,
                userSearchResults: searchResults
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

        case 'SCHEDULE_MEETING_SET_USER_SEARCH_VALUE': {
            state = {
                ...state,
                userSearchValue: payload
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
            let landlordToAdd = payload;

            if (!landlordToAdd.api_response) {
                // Handle case of adding landlord for outside
                landlordToAdd = mapUserForSearchResults(landlordToAdd);
            }

            const newParticipants = state.participants;
            newParticipants.push(landlordToAdd);

            state = {
                ...state,
                participants: [ ...newParticipants ],
                invitedLandlord: landlordToAdd
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

        case 'SCHEDULE_MEETING_CLEAR_PARTICIPANTS': {
            state = {
                ...state,
                participants: []
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

            break;
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

        case 'SCHEDULE_MEETING_SET_LANDLORD_SEARCH_VALUE': {
            state = {
                ...state,
                landlordSearchValue: payload
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
                listingSearchResults: listings.map(mapListingForSearchResults)
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

        case 'SCHEDULE_MEETING_SET_LISTING_SEARCH_VALUE': {
            state = {
                ...state,
                listingSearchValue: payload
            };

            break;
        }

        case 'SCHEDULE_MEETING_SET_LISTING': {
            let listing = payload;

            if (!listing.api_response) {
                // Handle setting listing from another container
                listing = mapListingForSearchResults(listing);
            }

            state = {
                ...state,
                listing
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

        case 'SCHEDULE_MEETING_GET_AGGREGATE_SCHEDULES_PENDING': {
            state = {
                ...state,
                isCalendarViewLoading: true,
                events: []
            };

            break;
        }

        case 'SCHEDULE_MEETING_GET_AGGREGATE_SCHEDULES_FULFILLED': {
            const {
                data: {
                    aggregatedEvents
                } = {}
            } = payload;

            state = {
                ...state,
                isCalendarViewLoading: false,
                events: aggregatedEvents
            };

            break;
        }

        case 'SCHEDULE_MEETING_GET_AGGREGATE_SCHEDULES_REJECTED': {
            state = {
                ...state,
                isCalendarViewLoading: false,
                events: []
            };

            break;
        }

        case 'SCHEDULE_MEETING_FORM_SUBMITTED': {
            state = {
                ...state,
                isMeetingFormLoading: true,
                meetingFormErrorMessage: null
            };

            break;
        }

        case 'SCHEDULE_MEETING_FORM_SUBMITTED_SUCCESS': {
            state = {
                ...state,
                isMeetingFormLoading: false
            };

            break;
        }

        case 'SCHEDULE_MEETING_FORM_SUBMITTED_REJECTED': {
            state = {
                ...state,
                isMeetingFormLoading: false,
                meetingFormErrorMessage: 'Could not create meeting, please try again later.'
            };

            break;
        }
    }

    return state;
}

export default scheduleMeetingReducer;
