const config = {
    listings: [],
    listing: {},
};

const listingReducer = (state = config, actions) => {
    switch(actions.type) {
        case 'GET_LISTINGS_FULFILLED': {
            const {
                data: {
                    listings
                } = {}
            } = actions.payload;

            state = {
                ...state,
                listings
            }

            console.log('Get listings is fulfilled');

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

        case 'GET_LISTING_BY_ID_FULFILLED' : {
            const {
                data: {
                    listing
                } = {}
            } = actions.payload;

            state = {
                ...state,
                listing
            }

            console.log('Get listing by id is fulfilled');
            
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
    }

    return state;
}

export default listingReducer;
