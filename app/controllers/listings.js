import { wrap as coroutine } from 'co';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import vision from '@google-cloud/vision';

import { required, convertToObjectId, extendIfPopulated, convertToBoolean, convertToNumber } from '../components/custom-utils';
import { findListings, getListingByIdWithOwnerPopulated, getListingViewers} from '../components/data';
import { sendError } from './utils';
import { isPrice, isInteger, isFullOrHalfInt, isPostalCode } from '../../common/validation';
import { listingTypes, provinces, cities, listingKeywords } from '../../common/constants';
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
        type,
        utilities,
        parking,
        internet,
        laundry,
        ac,
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
    viewsCollection = required('viewsCollection'),
    logger = required('logger', 'You must pass a logger for this function to use'),
}) => coroutine(function* (req, res) {

    let result;

    if (!req.params.id) {
        // Something weird has happened...
        logger.error('No id in parameters for get listing by id');

        return sendError({
            res,
            status: 400,
            message: 'No id in parameters for get listing by id'
        });
    }

    //if user is logged in check if they have viewed listing before.
    const {
        user: {
            _id: userId
        } = {}
    } = req;

    let viewLookup;

    if(userId){
        //check look up table to see if view exists
        try {
            viewLookup = yield getListingViewers({
                viewsCollection,
                userId: convertToObjectId(userId),
                listingId: convertToObjectId(req.params.id)
            });
        } catch (e){
            logger.error(e, `Error finding listing with user ${userId} on listing ${req.params.id}`);

            return sendError({
                res,
                status: 500,
                message: 'Error retrieving from views collection'
            });
        }
        //if view doesnt exist, add to view table and increase count
        if(Array.isArray(viewLookup) && viewLookup.length < 1){
            let listing;
            try{
                listing = yield findAndUpdate({
                    collection: listingsCollection,
                    query: {_id: req.params.id},
                    update: {$inc: {views: 1}}
                });
            } catch(e) {
                logger.error(e, `Error finding listing with id: ${req.params.id}`);
                return sendError({
                    res,
                    status: 500,
                    message: `Error finding listing with id: ${req.params.id}`
                });
            }

            if(!listing){
                return sendError({
                    res,
                    status: 404,
                    message: 'Error: user provided an invalid listing'
                });
            }

            const view = {
                userId: convertToObjectId(userId),
                listingId: convertToObjectId(req.params.id)
            }
            let viewResult;
            try {
                viewResult = yield insertInDb({
                    collection: viewsCollection,
                    document: view
                });
            } catch (e) {
                logger.error(e, `Error inserting document into views collection`)

                return sendError({
                    res,
                    status: 500,
                    message: 'Error inserting document into views collection'
                });
            }
        }
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

    let analyticsMessage;

    // Check if the user that is logged in matches the ownerId.
    if (result.ownerId.equals(convertToObjectId(userId)))
    {
        // If they match, look at all the keywords of this listing and compare with the keyword constants.
        // If there is a keyword that does not exist in the keyword constants, we will return with a message.
        let keywordsNotFound = [];
        result.keywords.forEach((keyword) => {
            if(!listingKeywords.find((item) => (item === keyword))) {
                keywordsNotFound.push(keyword);
            }
        });

        // Create a message to send the landlord about analytics.
        if(keywordsNotFound.length) {

            let removeWords = keywordsNotFound[0];
            keywordsNotFound.slice(1,keywordsNotFound.length).forEach(word => (removeWords += ', ' +  word));

            analyticsMessage = (`The most popular listings on our site feature the following concepts: <strong class='underlined'>kitchen, major appliance, recreation room, dishwasher</strong>. Your listing displays the following concepts: <strong class='underlined'>${removeWords}</strong>. We recommend you replace these images with some that showcase the former concepts.`);
        }
    }

    return res.json({
        listing: result,
        analyticsMessage
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
        UPLOADS_RELATIVE_PATH = required('UPLOADS_RELATIVE_PATH'),
        GOOGLE_APPLICATION_CREDENTIALS = required('GOOGLE_APPLICATION_CREDENTIALS'),
        ASSETS_ROOT = required('ASSETS_ROOT')
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

    // Generate the keywords for all the images.
    // Could be optimised if we check only new images and delete all keywords from the old images.
    let keywords = [];

    // Google vision client.
    const client = new vision.ImageAnnotatorClient();

    if(newImages.length) {
        let requests = newImages.map((image) => client.labelDetection(`${process.cwd()}/app${image}`));

        let responses = [];

        try {
            responses = yield Promise.all(requests);
        } catch (e) {
            logger.error(e, 'Error finding labels for images.');

            return sendError({
                res,
                status: 500,
                message: 'Error finding the labels for the images uploaded.'
            });
        }

        responses.forEach((response) => {
            const labels = response[0].labelAnnotations;

            labels.forEach((label) => {
                keywords.push(label.description);
            });
        });
    }

    // Make sure the update does not contain any null values.
    let update = {};
    update = extendIfPopulated(update, 'name', name);
    update = extendIfPopulated(update, 'description', description);
    update = extendIfPopulated(update, 'type', type);
    update = extendIfPopulated(update, 'price', convertToNumber(price));
    update = extendIfPopulated(update, 'bedrooms', bedrooms);
    update = extendIfPopulated(update, 'bathrooms', bathrooms);
    update = extendIfPopulated(update, 'unit', unit);
    update = extendIfPopulated(update, 'utilities', convertToBoolean(utilities));
    update = extendIfPopulated(update, 'furnished', convertToBoolean(furnished));
    update = extendIfPopulated(update, 'parking', convertToBoolean(parking));
    update = extendIfPopulated(update, 'internet', convertToBoolean(internet));
    update = extendIfPopulated(update, 'laundry', convertToBoolean(laundry));
    update = extendIfPopulated(update, 'airConditioning', convertToBoolean(airConditioning));
    update = extendIfPopulated(update, 'images', newImages);
    update = extendIfPopulated(update, 'keywords', keywords);

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
        UPLOADS_RELATIVE_FILE_PATH = required('UPLOADS_RELATIVE_FILE_PATH'),
        MAPS_API = required('MAPS_API'),
        GOOGLE_APPLICATION_CREDENTIALS = required('GOOGLE_APPLICATION_CREDENTIALS'),
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
    let keywords = [];

    // Google vision client.
    const client = new vision.ImageAnnotatorClient();

    if(req.files) {
        const requests = req.files.map((file) => client.labelDetection(file.path));

        let responses = [];

        try {
            responses = yield Promise.all(requests);
        } catch (e) {
            logger.error(e, 'Error finding labels for images.');

            return sendError({
                res,
                status: 500,
                message: 'Error finding the labels for the images uploaded.'
            });
        }

        responses.forEach((response) => {
            const labels = response[0].labelAnnotations;

            labels.forEach((label) => {
                keywords.push(label.description);
            });
        });

        req.files.forEach((file) => {
            if (file.filename && file.mimetype && file.path) {
                images.push(`${UPLOADS_RELATIVE_PATH}${file.filename}`);
            }
        })
    }

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
    let formattedAddressWithCity = formattedAddress;
    if(formattedAddress.indexOf(city) == -1){
        formattedAddressWithCity += `, ${city}`;
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
                price: convertToNumber(price),
                bedrooms,
                bathrooms,
                unit,
                utilities: convertToBoolean(utilities),
                furnished: convertToBoolean(furnished),
                parking: convertToBoolean(parking),
                internet: convertToBoolean(internet),
                laundry: convertToBoolean(laundry),
                airConditioning: convertToBoolean(airConditioning),
                location: formattedAddressWithCity,
                locationDisplay: formattedAddress,
                images,
                ownerId: convertToObjectId(req.user._id),
                keywords,
                lat,
                lng,
                views: 0,
                isCurrentlyLeased: false
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
