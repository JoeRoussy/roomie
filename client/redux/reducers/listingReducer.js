const config = {
    listings: [],
    listing: {},
    isEditing: false,
    isFormProcessing: false,
    myListings: [],
    myLeases: [],
    isDeleting: false,
    listingToDelete: {},
    analyticsMessage: null,
    isLoading: true
};

const listingReducer = (state = config, actions) => {
    const {
        type: actionType,
        payload
    } = actions;

    switch(actionType) {
        /* GET_LISTINGS */
        case 'GET_LISTINGS_FULFILLED': {
            const {
                data: {
                    listings
                } = {}
            } = payload;

            state = {
                ...state,
                listings
            }

            break;
        }
        case 'GET_LISTINGS_PENDING': {

            break;
        }
        case 'GET_LISTINGS_REJECTED' : {

            break;
        }
        /* END GET_LISTINGS */

        /* GET_LISTING_BY_ID */
        case 'GET_LISTING_BY_ID_FULFILLED' : {
            const {
                data: {
                    listing,
                    analyticsMessage
                } = {}
            } = payload;

            state = {
                ...state,
                listing,
                analyticsMessage,
                isLoading: false
            }

            break;
        }
        case 'GET_LISTING_BY_ID_PENDING': {
            state = {
                ...state,
                analyticsMessage: null,
                isLoading:true
            }

            break;
        }
        case 'GET_LISTING_BY_ID_REJECTED' : {
            state = {
                ...state,
                analyticsMessage: null,
                isLoading:false
            }

            break;
        }
        /* END GET_LISTING_BY_ID */

        /* GET_MY_LISTINGS */
        case 'GET_MY_LISTINGS_FULFILLED': {
            const {
                data: {
                    listings: myListings,
                    leases
                } = {}
            } = payload;

            state = {
                ...state,
                myListings,
                myLeases: leases
            }

            break;
        }
        case 'GET_MY_LISTINGS_PENDING': {
            break;
        }
        case 'GET_MY_LISTINGS_REJECTED' : {
            break;
        }
        /* END GET_MY_LISTINGS */

        /* CREATE_LISTING */
        case 'CREATE_LISTING_SUBMIT': {
            state = {
                ...state,
                isFormProcessing: true,
                errorMessage: null
            };

            break;
        }
        case 'CREATE_LISTING_FULFILLED': {
            const {
                data: {
                    listing
                } = {}
            } = payload;
            state = {
                ...state,
                isFormProcessing: false,
                listing
            };

            break;
        }
        case 'CREATE_LISTING_REJECTED': {
            const {
                response: {
                    data: {
                        errorKey
                    } = {}
                } = {}
            } = payload;

            let errorMessage;

            if (errorKey) {
                // We got an error key back so use an error message that relates to it
                const errorMessages = {
                    [process.env.LISTING_ERRORS_GENERIC]: 'Your request could not be processed',
                    [process.env.LISTING_ERRORS_INVALID_ADDRESS]: 'The listing address could not be found.',
                    [process.env.USER_ERROR_NOT_LOGGED_IN]: 'You must be a logged in user',
                    [process.env.USER_ERROR_NOT_LANDLORD]: 'You must be a landlord user'
                };

                errorMessage = errorMessages[errorKey];
            } else {
                // We did not get an error key back so use a generic error
                errorMessage = 'Your request could not be processed';
            }

            state = {
                ...state,
                isFormProcessing: false,
                errorMessage
            }

            break;
        }
        /* END CREATE_LISTING */

        /* UPDATE_LISTING */
        case 'UPDATE_LISTING_SUBMIT': {
            state = {
                ...state,
                isFormProcessing: true,
                errorMessage: null
            };

            break;
        }
        case 'UPDATE_LISTING_FULFILLED': {
            const {
                data: {
                    listing
                } = {}
            } = payload;
            state = {
                ...state,
                isFormProcessing: false,
                isEditing: false,
                listing
            };

            break;
        }
        case 'UPDATE_LISTING_REJECTED': {
            const {
                response: {
                    data: {
                        errorKey
                    } = {}
                } = {}
            } = payload;

            let errorMessage;

            if (errorKey) {
                // We got an error key back so use an error message that relates to it
                const errorMessages = {
                    [process.env.LISTING_ERRORS_GENERIC]: 'Your request could not be processed',
                    [process.env.USER_ERROR_NOT_LOGGED_IN]: 'You must be a logged in user',
                    [process.env.USER_ERROR_NOT_LANDLORD]: 'You must be a landlord user'
                };

                errorMessage = errorMessages[errorKey];
            } else {
                // We did not get an error key back so use a generic error
                errorMessage = 'Your request could not be processed';
            }

            state = {
                ...state,
                isFormProcessing: false,
                errorMessage
            }

            break;
        }
        /* END UPDATE_LISTING */

        /* EDIT_LISTING */
        case 'EDIT_LISTING': {
            state = {
                ...state,
                isEditing: true
            };

            break;
        }
        case 'EDIT_LISTING_CANCELLED': {
            state = {
                ...state,
                isEditing: false
            };

            break;
        }
        /* END EDIT_LISTING */

        /* DELETE_LISTING */
        case 'DELETING_LISTING': {
            state = {
                ...state,
                isDeleting: true,
                listingToDelete: payload
            };

            break;
        }
        case 'DELETING_LISTING_CANCELLED': {
            state = {
                ...state,
                isDeleting: false,
                listingToDelete: {}
            };

            break;
        }
        /* END DELETE_LISTING */

        /* DELETE_LISTING */
        case 'DELETE_LISTING_FULFILLED': {
            state = {
                ...state,
                isDeleting: false,
                listingToDelete: {}
            }
            break;
        }
        case 'DELETE_LISTING_PENDING': {
            break;
        }
        case 'DELETE_LISTING_REJECTED' : {
            state = {
                ...state,
                isDeleting: false,
                listingToDelete: {}
            }

            break;
        }
        /* END DELETE_LISTING */
    }

    return state;
}

export default listingReducer;
