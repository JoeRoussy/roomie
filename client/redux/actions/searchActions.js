import axios from 'axios';

export const search = (args='', len=0) => {
    const hasParams = (args) ? '?':'';
    let combinedArgs = (len>0) ? args[0]: '';

    for(let i = 1; i < len; ++i) combinedArgs += ('&' + args[i]);
        
    const action = {
        type: 'GET_SEARCH_RESULTS',
        payload: axios.get(`${process.env.API_ROOT}/api/listings${hasParams}${combinedArgs}`)
    }
    return action;
}


export const handleLocationChange = (val='') => {
    const action = {
        type: 'LOCATION_CHANGE',
        payload: {val}
    }
    return action;
}