const config ={
    listings: [],
    location: '',
    fulfilled: false,
    pending: false,
    rejected: false,
}

const searchReducer = (state = config, actions) => {
    switch(actions.type){
        case 'LOCATION_CHANGE': {
            state = {
                ...state, 
                location: actions.payload.val
            };
            break;
        }

        case 'GET_SEARCH_RESULTS_FULFILLED': {
            state = {
                ...state, 
                listings: state.listings.concat(actions.payload.data.listings),
                fulfilled: true,
                pending: false,
                rejected: false,
                errorMessage: null
            };
            break;
        }

        case 'GET_SEARCH_RESULTS_PENDING': {
            state = {
                ...state, 
                listings: [],
                fulfilled: false,
                pending: true,
                rejected: false
            };
            break;
        }

        case 'GET_SEARCH_RESULTS_REJECTED': {
            const {
                response:{
                    data:{
                        errorKey
                    }
                } = {}
            } = payload;

            let errorMessage;

            if(errorKey){
                const errorMessages = {
                    [process.env.SEARCH_ERRORS_MIN_PRICE_NAN]:'Minimum Price is not a number',
                    [process.env.SEARCH_ERRORS_MAX_PRICE_NAN]:'Maximum Price is not a number',
                    [process.env.SEARCH_ERRORS_MIN_PRICE_LESS_THAN_MAX_PRICE]:'Minimum Price is greater than Maximum Price'
                };

                errorMessage = errorMessages[errorKey];
            }
            else{
                errorMessage = 'Your search request could not be processed';
            }

            state = {
                ...state, 
                listings: [],
                fulfilled: false,
                pending: false,
                rejected: true,
                errorMessage
            };
            break;
        }
    }
    return state;
}

export default searchReducer;