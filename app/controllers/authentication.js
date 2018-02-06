import { wrap as coroutine } from 'co';
import jwt from 'jsonwebtoken';

import { required, isEmpty } from '../components/custom-utils';
import { sendError } from './utils';
import { getUserByEmail } from '../components/data';
import { comparePasswords } from '../components/authentication';
import { transformUserForOutput } from '../components/transformers';

export const login = ({
    usersCollection = required('usersCollection'),
    logger = required('logger', 'You must pass in a logger instance for this module to use')
}) => coroutine(function* (req, res) {
    const {
        body: {
            email,
            password
        } = {}
    } = req;

    const {
         SIGNIN_ERRORS_MISSING_VALUES,
         SIGNIN_ERRORS_INVALID_CREDENTIALS,
         SIGNIN_ERRORS_GENERIC
    } = process.env;

    if (!email || !password) {
        logger.warn(req.body, 'Got a log in submission with missing values');

        return sendError({
            res,
            status: 400,
            message: 'name and password are required',
            errorKey: SIGNIN_ERRORS_MISSING_VALUES
        });
    }

    let user = null;

    // Make sure there is a user for this email
    try {
        user = yield getUserByEmail({
            usersCollection,
            email
        });
    } catch (e) {
        logger.error({ err: e, email }, 'Error getting user by email');

        return sendError({
            res,
            status: 400,
            message: 'error during log in',
            errorKey: SIGNIN_ERRORS_MISSING_VALUES
        });
    }

    if (isEmpty(user)) {
        // No user for this email, send an error
        logger.info({ email }, 'Attempt to log in with invalid email');

        // For security purposes, do not distinguish between invalid emails and passwords
        return sendError({
            res,
            status: 400,
            message: 'Invalid credentials',
            errorKey: SIGNIN_ERRORS_INVALID_CREDENTIALS
        });
    }

    // Make sure the user's password and the submitted password are the same
    let isPasswordValid;

    try {
        isPasswordValid = yield comparePasswords(password, user.password);
    } catch (e) {
        logger.error(e, 'Error during password comparison');

        return sendError({
            res,
            status: 500,
            message: 'Error during login',
            errorKey: SIGNIN_ERRORS_GENERIC
        })
    }

    if (!isPasswordValid) {
        logger.info({ email }, 'Attempt to log in with invalid password');

        // For security purposes, do not distinguish between invalid emails and passwords
        return sendError({
            res,
            status: 400,
            message: 'Invalid credentials',
            errorKey: SIGNIN_ERRORS_INVALID_CREDENTIALS
        });
    }

    // Password is valid so lets return a jwt for this user
    const token = jwt.sign(transformUserForOutput(user), process.env.JWT_SECRET);

    return res.json({
        token
    });
});
