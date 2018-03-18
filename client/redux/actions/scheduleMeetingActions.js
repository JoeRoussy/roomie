import axios from 'axios';
import { toast } from 'react-toastify';

export const userSearch = (name) => ({
    type: 'USER_SEARCH_BY_NAME',
    payload: axios.get(`/api/users?name=${name}`)
        .catch((e) => {
            toast.error('Something went wrong with the user search, please try again later');

            // Return the error so other handlers can use it
            return e;
        })
});
