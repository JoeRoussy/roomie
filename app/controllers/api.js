import { wrap as coroutine } from 'co';

import { required, printd } from '../components/custom-utils';
import { findListings } from '../components/data';
import { sendError } from './utils';
import { isPrice } from '../../common/validation';
import {
    insert as insertInDb,
    getById,
    findAndUpdate,
    deleteById
} from '../components/db/service';

export const getListings = ({
    listingsCollection = required('listingsCollection'),
    logger = required('logger', 'You must pass a logger for this function to use')
}) => coroutine(function* (req, res) {
    const {
        bathrooms,
        bedrooms,
        furnished,
        keywords,
        maxPrice,
        minPrice,
        location = ''
    } = req.query;

    // Perform validation
    if (minPrice && !isPrice(minPrice)) {
        return sendError({
            res,
            status: 400,
            errorKey: SEARCH_ERRORS_MIN_PRICE_NAN,
            message: `Please enter a valid price for minimum price.`
        });
    }

    if (maxPrice && !isPrice(maxPrice)) {
       return sendError({
            res,
            status: 400,
            errorKey: SEARCH_ERRORS_MAX_PRICE_NAN,
            message: `Please enter a valid price for maximum price.`
        });
    }

    if (minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice)) {
        return sendError({
            res,
            status: 400,
            errorKey: SEARCH_ERRORS_MIN_PRICE_LESS_THAN_MAX_PRICE,
            message: `Minimum price is greater than maximum price.`
        });
    }

    //Search Db with query
    let result;

    try {
        result = yield findListings({
            listingsCollection,
            query: req.query // TODO: Make query use the maps
        });
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

export const getListingById = ({
    listingsCollection = required('listingsCollection'),
    logger = required('logger', 'You must pass a logger for this function to use'),
}) => coroutine(function* (req, res) {

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

    return res.json({
        listing: result
    });
});
