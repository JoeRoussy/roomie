import axios from 'axios';
import { push } from 'react-router-redux';
import { toast } from 'react-toastify';

export const submitForm = (formData)  => (dispatch) => {

    dispatch({
        type: 'ROOMMATE_SURVEY_FORM_SUBMITTED'
    });

    axios.post(`${process.env.API_ROOT}/api/roommateSurveys`, formData)
        .then((res) => {
            dispatch({
                type: 'ROOMMATE_SURVEY_FORM_FULFILLED',
                payload: res
            });

            toast.success('You are one step closer to finding your new roommates!');

            // The homepage will render the recommended roommates in place of the survey link
            dispatch(push('/'));
        })
        .catch((e) => {
            dispatch({
                type: 'ROOMMATE_SURVEY_FORM_REJECTED',
                payload: e
            });
        })
};

export const fetchCities = () => ({
    type: 'ROOMMATE_SURVEY_FETCH_CITIES',
    payload: axios.get(`${process.env.API_ROOT}/api/cities`)
});
