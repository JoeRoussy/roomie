import axios from 'axios';

export const getRoommateSuggestionsForUser = (user) => ({
    type: 'GET_ROOMMATE_SUGGESTIONS',
    payload: axios.get(`${process.env.API_ROOT}/api/users/${user._id}/recommendedRoommates`)
});
