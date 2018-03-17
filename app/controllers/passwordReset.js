import { wrap as coroutine } from 'co';
import jwt from 'jsonwebtoken';

import { required } from '../components/custom-utils';
import { sendError } from './utils';
import { isEmail } from '../../common/validation';
import { getUserByEmail, getPasswordResetLink, getUserForPasswordReset } from '../components/data';
import { findAndUpdate } from '../components/db/service';
import { sendPasswordResetEmail } from '../components/mail-sender';
import { transformUserForOutput } from '../components/transformers';
import { generateHash as generatePasswordHash } from '../components/authentication';
import { isPassword } from '../../common/validation';

export const sendEmail = ({
    passwordResetsCollection = required('passwordResetsCollection'),
    usersCollection = required('usersCollection'),
    logger = required('logger', 'You must pass in a logging instance for this module to use')
}) => coroutine(function* (req, res) {
    const {
        email
    } = req.body;

    const {
        PASSWORD_RESET_ERRORS_NO_USER_FOR_EMAIL = required('PASSWORD_RESET_ERRORS_NO_USER_FOR_EMAIL').
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
        logger.error(e, `Error finding user associated with email: ${email}`);

        return sendError({
            res,
            status: 500,
            message: 'There was an error processing your request',
            errorKey: PASSWORD_RESET_ERRORS_GENERIC
        });
    }

    if (!user) {
        return sendError({
            res,
            status: 400,
            message: 'Could not find user with that email',
            errorKey: PASSWORD_RESET_ERRORS_NO_USER_FOR_EMAIL
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

export const setNewPassword = ({
    passwordResetsCollection = required('passwordResetsCollection'),
    usersCollection = required('usersCollection'),
    logger = required('logger', 'You must pass in a logging instance for this module to use')
}) => coroutine(function* (req, res) {
    const {
        token,
        password
    } = req.body;

    const {
        PASSWORD_RESET_ERRORS_INVALID_TOKEN = required('PASSWORD_RESET_ERRORS_INVALID_TOKEN'),
        PASSWORD_RESET_ERRORS_GENERIC = required('PASSWORD_RESET_ERRORS_GENERIC')
    } = process.env;

    if (!isPassword(password)) {
        // No key needed because the front end already does this validation
        // This is just to prevent people from messing with the API directly
        return sendError({
            res,
            status: 400,
            message: 'Invalid password'
        });
    }

    // Find password reset collection by token (need to make sure it is not expired) and get user form it
    let result;

    try {
        [ result ] = yield getUserForPasswordReset({
            passwordResetsCollection,
            urlIdentifyer: token
        });
    } catch (e) {
        logger.error(e, `Error finding user associated with password resrt url identifier: ${token}`);

        return sendError({
            res,
            status: 500,
            message: 'Something went wrong processing your request',
            errorKey: PASSWORD_RESET_ERRORS_GENERIC
        });
    }

    if (!result) {
        return sendError({
            res,
            status: 400,
            message: 'Invalid password reset token',
            errorKey: PASSWORD_RESET_ERRORS_INVALID_TOKEN
        });
    }

    const {
        user,
        passwordResetId
    } = result;

    let newUser;
    const hashedPassword = yield generatePasswordHash(password);

    // Update the user with the new password
    try {
        newUser = yield findAndUpdate({
            collection: usersCollection,
            query: {
                _id: user._id
            },
            update: {
                password: hashedPassword
            }
        });
    } catch (e) {
        logger.error(e, `Error updating the password of user with ID: ${user._id}`);

        return sendError({
            res,
            status: 500,
            message: 'Something went wrong processing your request',
            errorKey: PASSWORD_RESET_ERRORS_GENERIC
        });
    }

    // Now get a jwt for this new user
    const jwtToken = jwt.sign(transformUserForOutput(user), process.env.JWT_SECRET);

    // Update the password reset as expired
    findAndUpdate({
        collection: passwordResetsCollection,
        query: {
            _id: passwordResetId
        },
        update: {
            expired: true
        }
    })
        .catch((e) => {
            // We don't care enough to scrap the password reset if this fails. This just means the user
            // can technically reset their password again. We'll just log it as an fyi.
            logger.error(e, `Error setting passwordReset with ID: ${passwordResetId} as expired`);
        });

    return res.json({
        token: jwtToken
    });
});
