import { wrap as coroutine } from 'co';
import { required } from '../components/custom-utils';
import { findListings } from '../components/data';

export const getListings = ({
    listingsCollection = required('listingsCollection'),
    logger = required('logger', 'You must pass a logger for this function to use')
}) => coroutine(function* (req, res) {
    // TODO: Get query parameters out of req.query
    const locationStr = req.query.location
    let result;

    try {
        result = yield findListings({
            listingsCollection,
            query: { $where: `this.location.indexOf("${locationStr}") != -1` } // TODO: Make query use the maps
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

// TODO: More api route handlers here
