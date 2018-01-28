import axios from 'axios';

import { toast } from 'react-toastify';

export const submitForm = (formData) => ({
    type: 'PROFILE_FORM_SUBMIT',
    payload: axios.put(`${API_ROOT}/users/${formData._id}`, {
        ...formData
    })
        .then(() => {
            // Use a toast to notify the user that their submission was successful
            toast.success('Your profile has been updated');
        });
})
