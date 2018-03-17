import axios from 'axios';

export const getProvinces = () => ({
    type: 'GET_PROVINCES',
    payload: axios.get(`${process.env.API_ROOT}/api/locations/provinces`)
});

export const getCitiesForProvince = (city) => ({
    type: 'GET_CITIES_FOR_PROVINCE',
    payload: axios.get(`${process.env.API_ROOT}/api/locations/${city}/cities`)
});
