/*
    This is a collection of useful functions for usage relating to redux
*/

import { setJwt } from '../../components';
import { setCurrentUser } from '../actions/userActions';
import jwtDecode from 'jwt-decode';

// Since our workflow is the same for handling login and signup responses, we pulled this functionality out and abstracted out
// the actual requests
export const handleAuthenticationRequest = ({
    promise,
    submitActionName,
    dispatch
}) => {
    dispatch({
        type: submitActionName
    });

    promise
        .then(res => {
            const {
                data: {
                    token
                } = {}
            } = res;

            setJwt(token);

            dispatch(setCurrentUser(jwtDecode(token)));
            dispatch({
                type: `${submitActionName}_FULFILLED`,
                payload: res
            });
        })
        .catch(e => {
            dispatch({
                type: `${submitActionName}_REJECTED`,
                payload: e.response
            });
        });
}
