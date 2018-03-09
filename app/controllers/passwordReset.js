import { wrap as coroutine } from 'co';

import { required } from '../components/custom-utils';
import { sendError } from './utils';
import { isEmail } from '../../common/validation';
import { getUserByEmail, getPasswordResetLink } from '../components/data';
import { sendPasswordResetEmail } from '../components/mail-sender';

export const sendEmail = ({
    passwordResetsCollection = required('passwordResetsCollection'),
    usersCollection = required('usersCollection'),
    logger = required('logger', 'You must pass in a logging instance for this module to use')
}) => coroutine(function* (req, res) {
    const {
        email
    } = req.body;

    const {
        PASSWORD_RESET_ERRORS_NOT_USER_FOR_ID = required('PASSWORD_RESET_ERRORS_NOT_USER_FOR_ID').
        PASSWORD_RESET_ERRORS_GENERIC = required('PASSWORD_RESET_ERRORS_GENERIC')
    } = process.env;

    if (!isEmail(email)) {
        return sendError({
            res,
            status: 400,
            message: 'You must provide a valid email'
        });
    }

    // See if there is a iser with this email
    let user;

    try {
        user = yield getUserByEmail({
            usersCollection,
            email
        });
    } catch (e) {
        logger.error(e, `Error finding user associated with email: ${email}`)
    }

    if (!user) {
        return sendError({
            res,
            status: 400,
            message: 'Could not find user with that email',
            errorKey: PASSWORD_RESET_ERRORS_NOT_USER_FOR_ID
        });
    }

    // Now that we know there is a user for this id, make a password reset document for this request
    let resetLink;

    try {
        resetLink = yield getPasswordResetLink({
            passwordResetsCollection,
            user
        });
    } catch (e) {
        logger.error(e, `Error getting password reset link for user with email: ${email}`);

        return sendError({
            res,
            status: 500,
            message: 'There was an error processing your request',
            errorKey: PASSWORD_RESET_ERRORS_GENERIC
        });
    }

    // Now use the reset link to send a password reset message
    try {
        yield sendPasswordResetEmail({
            user,
            resetLink
        });
    } catch (e) {
        logger.error(e, 'Error sending password reset email');

        return sendError({
            res,
            status: 500,
            message: 'There was an error processing your request',
            errorKey: PASSWORD_RESET_ERRORS_GENERIC
        });
    }

    // Everything has gone right so send a response with the email used
    return res.json({
        success: true,
        email
    });
});
