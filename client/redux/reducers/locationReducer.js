const config = {
    provinces: [],
    cities: []
};

const locationReducer = (state = config, actions) => {
    const {
        type: actionType,
        payload
    } = actions;

    switch(actionType) {
        case 'GET_PROVINCES_FULFILLED': {
            const {
                data: {
                    provinces
                } = {}
            } = payload;

            state = {
                ...state,
                provinces
            }

            break;
        }
        case 'GET_PROVINCES_PENDING': {
            console.log('Get provinces is pending');

            break;
        }
        case 'GET_PROVINCES_REJECTED' : {
            console.log('Get provinces was rejected');

            break;
        }

        case 'GET_CITIES_FOR_PROVINCE_FULFILLED': {
            const {
                data: {
                    cities
                } = {}
            } = payload;

            // If cities is empty
            if (!cities.length) {
                state = {
                    ...state,
                    errorMessage: 'We do not support that province yet.'
                };
            }

            state = {
                ...state,
                cities
            }

            break;
        }
        case 'GET_CITIES_FOR_PROVINCE_PENDING': {
            console.log('Get cities is pending');

            state = {
                ...state,
                errorMessage: null
            };

            break;
        }
        case 'GET_CITIES_FOR_PROVINCE_REJECTED' : {
            console.log('Get cities was rejected');

            break;
        }
    }

    return state;
}

export default locationReducer;
