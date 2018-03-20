import { wrap as coroutine } from 'co';
import { required } from '../components/custom-utils';
import { getById } from '../components/db/service';

export const sendError = ({
    res,
    status,
    message,
    errorKey
}) => res.status(status).json({
    error: true,
    message,
    errorKey
});

// Checks if ANY user is logged in
export const isAuthenticated = (req, res, next) => {
    if (!req.user) {
        return sendError({
            res,
            status: 403,
            message: 'You are not authorized to perform this action',
            errorKey: process.env.USER_ERROR_NOT_LOGGED_IN
        });
    }

    return next();
}


export const isEmailVerified = (req, res, next) => {
    if (!req.user.isEmailConfirmed) {
        return sendError({
            res,
            status: 400,
            message: 'You need to confirm your email to perform this action'
        });
    }

    return next();
}

// Checks if user is a landlord
export const isLandlord = (req, res, next) => {
    if (req.user) {
        if(!req.user.isLandlord) {
            return sendError({
                res,
                status: 403,
                message: 'You must be a landlord to perform this action',
                errorKey: process.env.USER_ERROR_NOT_LANDLORD
            });
        }
    }

    return next();
}

// Makes sure the current user is allowed to modify the user specified in the params of the route
// TODO: Add admin users later?
export const canModifyUser = (req, res, next) => {
    const {
        id
    } = req.params;

    const {
        user: {
            _id: currentUserId
        } = {}
    } = req;

    // NOTE: Both of these ids are actually strings so no use of the equals function for ObjectIDs is needed
    if (id !== currentUserId) {
        return sendError({
            res,
            status: 403,
            message: 'You are not authorized to perform an action on this user'
        });
    }

    return next();
}

// Checks to see if a user can modify (owns) the listing.
export const canModifyListing = ({
    listingsCollection = required('listingsCollection'),
    logger = required('logger', 'You must pass a logger for this function to use'),
}) => coroutine(function* (req, res, next) {

    let result;

    try {
        result = yield getById({
            collection: listingsCollection,
            id: req.params.id
        });
    } catch (e) {
        logger.error(e.err, e.msg);
        return res.status(500).json({
            error: true,
            message: `Could not get listing with id ${req.params.id}`
        });
    }

    if(result.ownerId != req.user._id)
    {
        return res.status(401).json({
            error: true,
            message: `You are not authorized to modify this listing.`
        });
    }

    return next();
})
