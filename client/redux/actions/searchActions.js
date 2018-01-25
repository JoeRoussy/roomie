import axios from 'axios';

export const search = (args='')=> {
    let hasParams = '?';
    if(args === '') hasParams = '';
    const action = {
        type: 'GET_SEARCH_RESULTS',
        payload: axios.get(`${process.env.API_ROOT}/api/listings${hasParams}${args}`)
    }
    return action;
}

export const getPopularListings = (num=5) => {
    const action = {
        type: 'GET_POPULAR_LISTINGS',
        payload: axios.get(`${process.env.API_ROOT}/api/popular-listings?num=${num}`)
    }
    return action;
}