const config = {
    listings: [],
    listing: {},
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
            console.log('Get listings is pending');

            break;
        }
        case 'GET_LISTINGS_REJECTED' : {
            console.log('Get listings was rejected');

            break;
        }

        /* GET_LISTING_BY_ID */
        case 'GET_LISTING_BY_ID_FULFILLED' : {
            const {
                data: {
                    listing
                } = {}
            } = payload;

            state = {
                ...state,
                listing
            }

            break;
        }
        case 'GET_LISTING_BY_ID_PENDING': {
            console.log('Get listing by id is pending');

            break;
        }
        case 'GET_LISTING_BY_ID_REJECTED' : {
            console.log('Get listing by id was rejected');

            break;
        }

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
            } = res;

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
                    [process.env.LISTING_ERRORS_MISSING_VALUES]: 'Please make sure you fill all required fields',
                    [process.env.LISTING_ERRORS_GENERIC]: 'Your request could not be processed',
                    [process.env.LISTING_ERRORS_INVALID_VALUES]: 'Invalid values entered for one or more fields',
                    [process.env.LISTING_ERRORS_INVALID_ADDRESS]: 'Invalid address given'
                };

                errorMessage = errorMessages[errorKey];

            } else {
                // We did not get an error key back so use a generic error
                errorMessage = 'Your request could not be processed'
            }

            state = {
                ...state,
                isFormProcessing: false,
                errorMessage
            }

            break;
        }
    }

    return state;
}

export default listingReducer;
