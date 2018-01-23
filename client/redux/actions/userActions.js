import axios from 'axios';

export const getCurrentUser = () => ({
    type: 'GET_CURRENT_USER',
    payload: axios.get(`${process.env.API_ROOT}/api/users/me`)
});
