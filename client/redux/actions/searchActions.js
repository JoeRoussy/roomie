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


export const handleLocationChange = (val='')=> {
    const action = {
        type: 'LOCATION_CHANGE',
        payload: val
    }
    return action;
}