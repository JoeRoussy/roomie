import { wrap as coroutine } from 'co';
import jwt from 'jsonwebtoken';
import axios from 'axios';

import { required, convertToObjectId, extendIfPopulated, convertToBoolean } from '../components/custom-utils';
import { findListings, getListingByIdWithOwnerPopulated } from '../components/data';
import { sendError } from './utils';
import { isPrice, isInteger, isFullOrHalfInt, isPostalCode } from '../../common/validation';
import { listingTypes, provinces, cities } from '../../common/constants';
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
        location = '',
        ownerId
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

    if (!req.params.id) {
        // Something weird has happened...
        logger.error('No id in parameters for get listing by id');

        return res.status(500).json({
            error: true,
            message: `Could not get listing with id ${req.params.id}`
        });
    }

    try {
        result = yield getListingByIdWithOwnerPopulated({
            listingsCollection,
            id: convertToObjectId(req.params.id)
        });
    } catch (e) {
        logger.error(e, `Error finding listing with id: ${req.params.id}`);

        return res.status(500).json({
            error: true,
            message: `Could not get listing with id ${req.params.id}`
        });
    }

    return res.json({
        listing: result
    });
});

export const updateListing = ({
    listingsCollection = required('listingsCollection'),
    logger = required('logger', 'You must pass in a logger for this function to use')
}) => coroutine(function* (req, res) {
    const {
        body: {
            name,
            description,
            type,
            price,
            bedrooms,
            bathrooms,
            unit,
            utilities,
            furnished,
            parking,
            internet,
            laundry,
            airConditioning,
            images = []
        } = {},
        files: [
            {
                filename,
                mimetype,
                path
            } = {}
        ] = []
    } = req;

    const {
        LISTING_ERRORS_GENERIC = required('LISTING_ERRORS_GENERIC'),
        UPLOADS_RELATIVE_PATH = required('UPLOADS_RELATIVE_PATH')
    } = process.env;

    /* Perform field validation. */

    // Enforce required fields
    if (!name || !description || !type || !price || !bedrooms || !bathrooms) {
        logger.warn(req.body, 'Malformed body for listing creation, empty fields.');

        return sendError({
            res,
            status: 400,
            message: 'Fill out all required fields.'
        });
    }

    // If listing type is not in the array of accepted listing types.
    if (!listingTypes.find((element) => (element.value === type))) {
        logger.warn(req.body, 'Malformed body for listing creation, invalid listing type.');

        return sendError({
            res,
            status: 400,
            message: 'Invalid values given.'
        });
    }

    // Check if price is valid.
    if (!isPrice(price)) {
        logger.warn(req.body, 'Malformed body for listing creation, invalid price.');

        return sendError({
            res,
            status: 400,
            message: 'Invalid values given.'
        });
    }

    // Check if number of bedrooms is an integer.
    if (!isInteger(bedrooms)) {
        logger.warn(req.body, 'Malformed body for listing creation, invalid bedrooms.');

        return sendError({
            res,
            status: 400,
            message: 'Invalid values given.'
        });
    }

    // Check if number of bathrooms is either an integer or integer and half.
    if (!isFullOrHalfInt(bathrooms)) {
        logger.warn(req.body, 'Malformed body for listing creation, invalid bathrooms.');

        return sendError({
            res,
            status: 400,
            message: 'Invalid values given.'
        });
    }

    let newImages = images;

    if(req.files) {
        req.files.forEach((file) => {
            if (file.filename && file.mimetype && file.path) {
                newImages.push(`${UPLOADS_RELATIVE_PATH}${file.filename}`);
            }
        })
    }

    // Convert all the checkboxed strings to boolean values.
    const utilitiesBool = convertToBoolean(utilities);
    const furnishedBool = convertToBoolean(furnished);
    const parkingBool = convertToBoolean(parking);
    const internetBool = convertToBoolean(internet);
    const laundryBool = convertToBoolean(laundry);
    const airConditioningBool = convertToBoolean(airConditioning);

    // Make sure the update does not contain any null values.
    let update = {};
    update = extendIfPopulated(update, 'name', name);
    update = extendIfPopulated(update, 'description', description);
    update = extendIfPopulated(update, 'type', type);
    update = extendIfPopulated(update, 'price', price);
    update = extendIfPopulated(update, 'bedrooms', bedrooms);
    update = extendIfPopulated(update, 'bathrooms', bathrooms);
    update = extendIfPopulated(update, 'unit', unit);
    update = extendIfPopulated(update, 'utilities', utilitiesBool);
    update = extendIfPopulated(update, 'furnished', furnishedBool);
    update = extendIfPopulated(update, 'parking', parkingBool);
    update = extendIfPopulated(update, 'internet', internetBool);
    update = extendIfPopulated(update, 'laundry', laundryBool);
    update = extendIfPopulated(update, 'airConditioning', airConditioningBool);
    update = extendIfPopulated(update, 'images', newImages);

    let newListing;

    try {
        newListing = yield findAndUpdate({
            collection: listingsCollection,
            query: { _id: req.params.id },
            update
        });
    } catch (e) {
        logger.error(e, `Error updating listing with id: ${req.params.id}`);

        return sendError({
            res,
            status: 500,
            message: 'Could not update listing',
            errorKey: LISTING_ERRORS_GENERIC
        });
    }

    return res.json({
        listing: newListing
    });

});

export const createListing = ({
    listingsCollection = required('listingsCollection'),
    logger = required('logger', 'You must pass in a logger for this function to use')
}) => coroutine(function* (req, res) {
    const {
        body: {
            name,
            description,
            country='Canada',
            province,
            postalCode,
            city,
            street,
            type,
            price,
            bedrooms,
            bathrooms,
            unit,
            utilities,
            furnished,
            parking,
            internet,
            laundry,
            airConditioning
        } = {},
        files: [
            {
                filename,
                mimetype,
                path
            } = {}
        ] = []
    } = req;

    const {
        LISTING_ERRORS_GENERIC = required('LISTING_ERRORS_GENERIC'),
        UPLOADS_RELATIVE_PATH = required('UPLOADS_RELATIVE_PATH'),
        MAPS_API = required('MAPS_API'),
        GEOLOCATION_ADDRESS = required('GEOLOCATION_ADDRESS'),
        LISTING_ERRORS_INVALID_ADDRESS = required('LISTING_ERRORS_INVALID_ADDRESS')
    } = process.env;

    /* Perform field validation. */

    // Enforce required fields
    if (!name || !description || !country || !province || !postalCode || !city || !street || !type || !price || !bedrooms || !bathrooms) {
        logger.warn(req.body, 'Malformed body for listing creation, empty fields.');

        return sendError({
            res,
            status: 400,
            message: 'Fill out all required fields.'
        });
    }

    // Check if postal code is valid.
    if (!isPostalCode(postalCode)) {
        logger.warn(req.body, 'Malformed body for listing creation, invalid postal code.');

        return sendError({
            res,
            status: 400,
            message: 'Invalid values given.'
        });
    }

    // If the province is not in the array of accepted provinces.
    if (!provinces.find((element) => (element.value === province))) {
        logger.warn(req.body, 'Malformed body for listing creation, invalid province.');

        return sendError({
            res,
            status: 400,
            message: 'Invalid values given.'
        });
    }

    // If the city is not in the array of accepted cities.
    if (!cities.find((element) => (element.value === city))) {
        logger.warn(req.body, 'Malformed body for listing creation, invalid city.');

        return sendError({
            res,
            status: 400,
            message: 'Invalid values given.'
        });
    }

    // If listing type is not in the array of accepted listing types.
    if (!listingTypes.find((element) => (element.value === type))) {
        logger.warn(req.body, 'Malformed body for listing creation, invalid listing type.');

        return sendError({
            res,
            status: 400,
            message: 'Invalid values given.'
        });
    }

    // Check if price is valid.
    if (!isPrice(price)) {
        logger.warn(req.body, 'Malformed body for listing creation, invalid price.');

        return sendError({
            res,
            status: 400,
            message: 'Invalid values given.'
        });
    }

    // Check if number of bedrooms is an integer.
    if (!isInteger(bedrooms)) {
        logger.warn(req.body, 'Malformed body for listing creation, invalid bedrooms.');

        return sendError({
            res,
            status: 400,
            message: 'Invalid values given.'
        });
    }

    // Check if number of bathrooms is either an integer or integer and half.
    if (!isFullOrHalfInt(bathrooms)) {
        logger.warn(req.body, 'Malformed body for listing creation, invalid bathrooms.');

        return sendError({
            res,
            status: 400,
            message: 'Invalid values given.'
        });
    }

    let images = [];

    if(req.files) {
        req.files.forEach((file) => {
            if (file.filename && file.mimetype && file.path) {
                images.push(`${UPLOADS_RELATIVE_PATH}${file.filename}`);
            }
        })
    }

    // Convert all the checkboxed strings to boolean values.
    const utilitiesBool = convertToBoolean(utilities);
    const furnishedBool = convertToBoolean(furnished);
    const parkingBool = convertToBoolean(parking);
    const internetBool = convertToBoolean(internet);
    const laundryBool = convertToBoolean(laundry);
    const airConditioningBool = convertToBoolean(airConditioning);

    // Combine address to store as location.
    const query = `address=${street} ${city},${province} ${postalCode},${country}`;

    let mapsResponse;

    try {
        mapsResponse = yield axios.get(encodeURI(`${GEOLOCATION_ADDRESS}/json?${query}&key=${MAPS_API}`));
    } catch (e) {
        logger.error(e, 'Error finding location.');

        return sendError({
            res,
            status: 500,
            message: 'Error finding the location of the listing.'
        });
    }

    const {
        data: {
            results: [
                {
                    formatted_address: formattedAddress,
                    geometry: {
                        location: {
                            lat,
                            lng
                        } = {}
                    } = {}
                } = {}
            ] = []
        } = {}
    } = mapsResponse;

    if (!(formattedAddress && lat && lng)) {
        logger.error(`Could not find lat and lng information for query: ${query}`);

        return sendError({
            res,
            status: 400,
            message: 'Error finding the location of the listing.',
            errorKey: LISTING_ERRORS_INVALID_ADDRESS
        });
    }

    let savedListing;

    try {
        savedListing = yield insertInDb({
            collection: listingsCollection,
            document: {
                name,
                description,
                country,
                province,
                postalCode,
                street,
                city,
                type,
                price,
                bedrooms,
                bathrooms,
                unit,
                utilities: utilitiesBool,
                furnished: furnishedBool,
                parking: parkingBool,
                internet: internetBool,
                laundry: laundryBool,
                airConditioning: airConditioningBool,
                location: formattedAddress,
                images,
                ownerId: convertToObjectId(req.user._id),
                keywords: [],
                lat,
                lng
            },
            returnInsertedDocument: true
        });
    } catch (e) {
        logger.error({ err: e, name }, 'Error saving new listing to database');

        return sendError({
            res,
            status: 500,
            message: 'Could not create listing',
            errorKey: LISTING_ERRORS_GENERIC
        });
    }

    return res.json({
        listing: savedListing
    });
});
