import { wrap as coroutine } from 'co';
import jwt from 'jsonwebtoken';
import { required, print, isEmpty } from '../components/custom-utils';
import { findListings, getUserByEmail } from '../components/data';
import { insert as insertInDb } from '../components/db/service';
import { generateHash as generatePasswordHash } from '../components/authentication';
import { transformUserForOutput } from '../components/transformers';

// Returns an error message with the specifed status
function sendError(res, status, message) {
    return res.status(status).json({
        error: true,
        message
    });
}

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

        return sendError(res, 500, message);
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
        USER_TYPE_LANDLORD
    } = process.env;

    if (!name || !email || !password || !userType) {
        logger.warn(req.body, 'Malformed body for user creation');

        return sendError(res, 400, 'Creating a user requires a name, an email, a password, and a user type');
    }

    if (!(userType === USER_TYPE_TENANT || userType === USER_TYPE_LANDLORD)) {
        return sendError(res, 400, `userType must be either \"${USER_TYPE_TENANT}\" or \"${USER_TYPE_LANDLORD}\"`)
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

        return sendError(res, 500, 'Could not sign up');
    }

    console.log('User after dupe email check');
    console.log(user);
    console.log(isEmpty(user));

    if (!isEmpty(user)) {
        logger.warn({ email }, 'Attempt to sign up with existing user email');

        return sendError(res, 400, `A user with email: ${email} already exists`);
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

        return sendError(res, 500, 'Could not sign up');
    }

    // Now that the user has been saved, return a jwt encapsulating the new user (transformered for output)
    const token = jwt.sign(transformUserForOutput(savedUser), process.env.JWT_SECRET);

    return res.json({
        token
    });
});

// TODO: More api route handlers here
