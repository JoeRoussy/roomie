import { wrap as coroutine } from 'co';
import jwt from 'jsonwebtoken';
import { required, print, isEmpty } from '../components/custom-utils';
import { findListings, getUserByEmail } from '../components/data';
import { insert as insertInDb } from '../components/db/service';
import { generateHash as generatePasswordHash } from '../components/authentication';
import { transformUserForOutput } from '../components/transformers';

// Returns an error message with the specifed status
const sendError = ({
    res,
    status,
    message,
    errorKey
}) => res.status(status).json({
    error: true,
    message,
    errorKey
});

export const getListings = ({
    listingsCollection = required('listingsCollection'),
    logger = required('logger', 'You must pass a logger for this function to use')
}) => coroutine(function* (req, res) {
    // TODO: Get query parameters out of req.query

    let result;

    try {
        result = yield findListings({
            listingsCollection,
            query: {} // TODO: Add query functionality
        })
    } catch (e) {
        logger.error(e, 'Error finding listings');

        return sendError({
            res,
            status: 500,
            message: 'Error finding listings'
        });
    }

    return res.json({
        listings: result
    });
});

// Creates a new user and logs them in
export const createUser = ({
    usersCollection = required('usersCollection'),
    logger = required('logger', 'You must pass in a logger for this function to use')
}) => coroutine(function* (req, res) {
    const {
        body: {
            name,
            email,
            password,
            userType
        } = {}
    } = req;

    const {
        USER_TYPE_TENANT,
        USER_TYPE_LANDLORD,
        SIGNUP_ERRORS_EXISTING_EMAIL,
        SIGNUP_ERRORS_GENERIC,
        SIGNUP_ERRORS_MISSING_VALUES,
        SIGNUP_ERRORS_INVALID_VALUES
    } = process.env;

    if (!name || !email || !password || !userType) {
        logger.warn(req.body, 'Malformed body for user creation');

        return sendError({
            res,
            status: 400,
            message: 'Creating a user requires a name, an email, a password, and a user type',
            errorKey: SIGNUP_ERRORS_MISSING_VALUES
        });
    }

    if (!(userType === USER_TYPE_TENANT || userType === USER_TYPE_LANDLORD)) {
        return sendError({
            res,
            status: 400,
            message: `userType must be either \"${USER_TYPE_TENANT}\" or \"${USER_TYPE_LANDLORD}\"`,
            errorKey: SIGNUP_ERRORS_INVALID_VALUES
        });
    }

    // First see if a user with this email exists
    let user = null;
    try {
        user = yield getUserByEmail({
            email,
            usersCollection
        });
    } catch (e) {
        logger.error(e, `Error checking if user with email: ${email} exists`);

        return sendError({
            res,
            status: 500,
            message: 'Could not sign up',
            errorKey: SIGNUP_ERRORS_GENERIC
        });
    }

    if (!isEmpty(user)) {
        logger.warn({ email }, 'Attempt to sign up with existing user email');

        return sendError({
            res,
            status: 400,
            message: `A user with email: ${email} already exists`,
            errorKey: SIGNUP_ERRORS_EXISTING_EMAIL
        });
    }

    // No user with this email exists so lets make one
    const hashedPassword = yield generatePasswordHash(password);
    let savedUser;

    try {
        savedUser = yield insertInDb({
            collection: usersCollection,
            document: {
                name,
                email,
                password: hashedPassword,
                isLandlord: userType === process.env.USER_TYPE_LANDLORD
            },
            returnInsertedDocument: true
        });
    } catch (e) {
        logger.error({ err: e, name, email }, 'Error saving new user to database');

        return sendError({
            res,
            status: 500,
            message: 'Could not sign up',
            errorKey: SIGNUP_ERRORS_GENERIC
        });
    }

    // Now that the user has been saved, return a jwt encapsulating the new user (transformered for output)
    const token = jwt.sign(transformUserForOutput(savedUser), process.env.JWT_SECRET);

    return res.json({
        token
    });
});

// TODO: More api route handlers here
