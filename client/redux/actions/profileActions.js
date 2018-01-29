import axios from 'axios';
import { toast } from 'react-toastify';

import { setJwt } from '../../components';

export const submitForm = (formData) => ({
    type: 'PROFILE_FORM_SUBMIT',
    payload: axios.put(`${process.env.API_ROOT}/api/users/${formData._id}`, {
        ...formData
    })
        .then((res) => {
            const {
                data: {
                    token
                } = {}
            } = res;

            // The value of the user has changed so we should save a new token
            // NOTE: The user reducer will take care of setting the new value of the user in the state
            setJwt(token);

            // Use a toast to notify the user that their submission was successful
            toast.success('Your profile has been updated');

            // We must return the res object so it can be used by other fulfilled handlers (in reducers for example)
            return res;
        })
})
