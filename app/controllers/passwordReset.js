import { wrap as coroutine } from 'co';

import { required } from '../components/custom-utils';

export const sendResetPasswordEmail = ({
    verificationsCollection = required('verificationsCollection'),
    usersCollection = required('usersCollection'),
    logger = required('logger', 'You must pass in a logging instance for this module to use')
}) => coroutine(function* (req, res) {
    console.log('Form data from reset password request');
    console.log(req.body);

    setTimeout(function() {
        return res.json({});
    }, 2000);
});
