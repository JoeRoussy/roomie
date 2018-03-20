import { wrap as coroutine } from 'co';

import { required } from '../components/custom-utils';
import { getListingsByOwner } from '../components/data';
import { sendError } from './utils';

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
