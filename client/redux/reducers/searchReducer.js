const config ={
    basic: '',
    advanced: ''
}

const searchReducer = (state = config, actions) => {
    switch(actions.type){
        case 'GET_SEARCH_RESULTS_FULFILLED': {
            
            break;
        }

        case 'GET_SEARCH_RESULTS_PENDING': {

            break;
        }

        case 'GET_SEARCH_RESULTS_REJECTED': {

            break;
        }
    }
    return state;
}

export default searchReducer;