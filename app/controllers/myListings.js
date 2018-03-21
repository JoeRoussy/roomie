import { wrap as coroutine } from 'co';

import { required, convertToObjectId } from '../components/custom-utils';
import { getListingsByOwner, getListingByIdWithOwnerPopulated } from '../components/data';
import { sendError } from './utils';
import { deleteById } from '../components/db/service';

export const getMyListings = ({
    listingsCollection = required('listingsCollection'),
    logger = required('logger', 'You must pass a logger for this function to use')
}) => coroutine(function* (req, res) {
    let result;

    try {
        result = yield getListingsByOwner({
            listingsCollection,
            ownerId: req.user._id
        });
    } catch (e) {
        logger.error(e, `Error finding listings for user ${req.user._id}`);

        return sendError({
            res,
            status: 500,
            message: 'Error finding listings for owner.'
        });
    }

    return res.json({
        listings: result
    });
});


export const deleteMyListing = ({
    listingsCollection = required('listingsCollection'),
    logger = required('logger', 'You must pass a logger for this function to use')
}) => coroutine(function* (req, res) {
    if (!req.params.id) {
        // Something weird has happened...
        logger.error('No id in parameters for delete listing by id');

        return res.status(400).json({
            error: true,
            message: `No id provided`
        });
    }

    const listingId = req.params.id;
    const userId = req.user._id;

    let result;

    try {
        result = yield getListingByIdWithOwnerPopulated({
            listingsCollection,
            id: convertToObjectId(listingId)
        });
    } catch (e) {
        logger.error(e,`Error getting listing id ${listingId} with owner ${userId}`);

        return sendError({
            res,
            status: 500,
            message: 'Error finding listing for owner.'
        });
    }

    // Check the owner id matches the user id
    if (result.ownerId.equals(convertToObjectId(userId)))
    {
        try {
            result = yield deleteById({
                collection: listingsCollection,
                id: listingId
            })
        } catch (e) {
            logger.error(e,`Error deleting listing id ${listingId} with owner ${userId}`);

            return sendError({
                res,
                status: 500,
                message: 'Error deleting listing for owner.'
            });
        }
    }
    else {
        return sendError({
            res,
            status: 401,
            message: 'Not owner of listing'
        });
    }

    return res.json({
        listings: result
    });
});
