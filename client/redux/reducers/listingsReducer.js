const config = {
    listings: []
}

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
    }

    return state;
}

export default listingReducer;
