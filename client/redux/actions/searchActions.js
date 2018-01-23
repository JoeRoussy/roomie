import axios from 'axios';

export const search = (args='')=> {
    const action = {
        type: 'GET_SEARCH_RESULTS',
        payload: axios.get(`${process.env.API_ROOT}/api/listings?`)
    }
    return action;
}