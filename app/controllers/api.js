import { wrap as coroutine } from 'co';
import { required } from '../components/custom-utils';
import { findListings } from '../components/data';

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

        return res.status(500).json({
            error: true,
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
            passsword,
            userType
        } = {}
    } = req;

    const {
        USER_TYPE_TENANT,
        USER_TYPE_LANDLORD
    } = process.env;

    if (!name || !email || !password || !userType) {
        logger.warn(req.body, 'Malformed body for user creation');

        return res.status(400).json({
            error: true,
            message: 'Creating a user requires a name, an email, a password, and a user type'
        });
    }

    if (!(userType === USER_TYPE_TENANT || userType === USER_TYPE_LANDLORD)) {
        return res.status(400).json({
            error: true,
            message: `userType must be either \"${USER_TYPE_TENANT}\" or \"${USER_TYPE_LANDLORD}\" `
        });
    }

    // First see if a user with this email exists
    let user = null;
    try {
        user = getUserByEmail({
            email,
            userCollection
        });
    } catch (e) {
        logger.error(e, `Error checking if user with email: ${email} exists`);

        return res.status(500).json({
            error: true,
            message: 'Could not sign up'
        });
    }

    if (user) {
        logger.warn({ email }, 'Attempt to sign up with existing user email');

        return res.status(400).json({
            error: true,
            message: `A user with email: ${email} already exists`
        });
    }

    // Now that we know this is a new email, try creating a new user
    


    setTimeout(() => {
        return res.json({
            user: {
                name: 'Joe Roussy',
                email: 'joeroussy@gmail.com'
            }
        });
    }, 3000);
});

// Inspects the current session to see if there is a user logged in.
// If there is a user they are returned, otherwise null is returned
export const getCurrentUser = (req, res) => {
    // NOTE: Passport will populate req.user if their session is still active
    const {
        user = null
    } = req;

    return res.json({
        user
    });
}

// TODO: More api route handlers here
