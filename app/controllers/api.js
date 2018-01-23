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
        logger.error(e.err, e.msg);

        return res.status(500).json({
            error: true,
            message: 'Could not get listings'
        });
    }

    return res.json({
        listings: result
    });
});

export const createUser = ({
    usersCollection = required('usersCollection'),
    logger = required('logger', 'You must pass in a logger for this function to use')
}) => coroutine(function* (req, res) {

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
