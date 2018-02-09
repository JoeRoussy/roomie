import { wrap as coroutine } from 'co';
import jwt from 'jsonwebtoken';

import { required, print, isEmpty, extendIfPopulated } from '../components/custom-utils';
import { findListings, getUserByEmail } from '../components/data';
import { insert as insertInDb, getById, findAndUpdate } from '../components/db/service';
import { generateHash as generatePasswordHash } from '../components/authentication';
import { transformUserForOutput } from '../components/transformers';
import { sendError } from './utils';


/* LISTINGS */
export const getListings = ({
    listingsCollection = required('listingsCollection'),
    logger = required('logger', 'You must pass a logger for this function to use')
}) => coroutine(function* (req, res) {
    // TODO: Get query parameters out of req.query

    const {
        location = ''
    } = req.query;

    let result;

    try {
        result = yield findListings({
            listingsCollection,
            query: { $where: `this.location.indexOf("${location}") != -1` } // TODO: Make query use the maps
        })
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

// TODO: We need to send the user here as well, so we can associate the user with this listing.
export const createListing = ({
    listingsCollection = required('listingsCollection'),
    logger = required('logger', 'You must pass in a logger for this function to use')
}) => coroutine(function* (req, res) {
    const {
        body: {
            name,
            address,
            description,
            location
        } = {}
    } = req;

    const {
        LISTING_ERRORS_MISSING_VALUES=LISTING_ERRORS_MISSING_VALUES,
        LISTING_ERRORS_GENERIC=LISTING_ERRORS_GENERIC,
        LISTING_ERRORS_INVALID_VALUES=LISTING_ERRORS_INVALID_VALUES,
        LISTING_ERRORS_INVALID_ADDRESS=LISTING_ERRORS_INVALID_ADDRESS
    } = process.env;

    // TODO: Finalize these fields and add additional fields.
    if (!name || !address || !description || !location) {
        logger.warn(req.body, 'Malformed body for listing creation');

        return sendError({
            res,
            status: 400,
            message: 'Creating a listing requires a name, an address, a description, and a location',
            errorKey: LISTING_ERRORS_MISSING_VALUES
        });
    }

    let savedListing;

    try {
        savedListing = yield insertInDb({
            collection: listingsCollection,
            document: {
                name,
                address,
                description,
                location
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
        } = {},
        file: {
            filename,
            mimetype,
            path
        } = {}
    } = req;

    const {
        USER_TYPE_TENANT,
        USER_TYPE_LANDLORD,
        SIGNUP_ERRORS_EXISTING_EMAIL,
        SIGNUP_ERRORS_GENERIC,
        SIGNUP_ERRORS_MISSING_VALUES,
        SIGNUP_ERRORS_INVALID_VALUES,
        UPLOADS_RELATIVE_PATH
    } = process.env;

    let imageFields = {};

    if (filename && mimetype && path) {
        // We have an image upload that we need to include in the saved user
        // NOTE: Validation middleware has already run by the time we get here so we can assume the image is valid

        imageFields = {
            profilePictureLink: `${UPLOADS_RELATIVE_PATH}${filename}`
        };
    }

    if (!name || !email || !password || !userType) {
        logger.warn(req.body, 'Malformed body for user creation');

        return sendError({
            res,
            status: 400,
            message: 'Creating a user requires a name, an email, a password, and a user type',
            errorKey: SIGNUP_ERRORS_MISSING_VALUES
        });
    }

    if (!(userType === USER_TYPE_TENANT || userType === USER_TYPE_LANDLORD)) {
        return sendError({
            res,
            status: 400,
            message: `userType must be either \"${USER_TYPE_TENANT}\" or \"${USER_TYPE_LANDLORD}\"`,
            errorKey: SIGNUP_ERRORS_INVALID_VALUES
        });
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

        return sendError({
            res,
            status: 500,
            message: 'Could not sign up',
            errorKey: SIGNUP_ERRORS_GENERIC
        });
    }

    if (!isEmpty(user)) {
        logger.warn({ email }, 'Attempt to sign up with existing user email');

        return sendError({
            res,
            status: 400,
            message: `A user with email: ${email} already exists`,
            errorKey: SIGNUP_ERRORS_EXISTING_EMAIL
        });
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
                isLandlord: userType === process.env.USER_TYPE_LANDLORD,
                ...imageFields
            },
            returnInsertedDocument: true
        });
    } catch (e) {
        logger.error({ err: e, name, email }, 'Error saving new user to database');

        return sendError({
            res,
            status: 500,
            message: 'Could not sign up',
            errorKey: SIGNUP_ERRORS_GENERIC
        });
    }

    // Now that the user has been saved, return a jwt encapsulating the new user (transformered for output)
    const token = jwt.sign(transformUserForOutput(savedUser), process.env.JWT_SECRET);

    return res.json({
        token
    });
});

// Allows us to edit attributes of a user other than profile picture, createdAt, and password
export const editUser = ({
    usersCollection = required('usersCollection'),
    logger = required('logger', 'You need to pass in a logger for this function to use')
}) => coroutine(function* (req, res) {
    const {
        id
    } = req.params;

    // We can only update the name and email using this route
    const {
        body: {
            name,
            email
        } = {},
        file: {
            filename,
            mimetype,
            path
        } = {}
    } = req;

    const {
        PROFILE_EDIT_ERRORS_GENERIC,
        PROFILE_EDIT_ERRORS_DUPLICATE_EMAIL,
        UPLOADS_RELATIVE_PATH
    } = process.env;

    // Make sure the user is not trying to change their email to one that already exists
    if (email) {
        let existingUser;

        try {
            existingUser = yield getUserByEmail({
                email,
                usersCollection
            });
        } catch (e) {
            logger.error(e, 'Error getting user by email for duplicate email check');

            return sendError({
                res,
                status: 500,
                message: 'Could not update user',
                errorKey: PROFILE_EDIT_ERRORS_GENERIC
            });
        }

        // Make sure there is not an existing user, and if there is, make sure it is not the current user
        if (existingUser && !existingUser._id.equals(req.user._id)) {
            logger.info({ currentUser: req.user, existingUser: existingUser }, 'Attempt to edit email to another email that already exists');

            return sendError({
                res,
                status: 400,
                message: 'A user already exists with that email',
                errorKey: PROFILE_EDIT_ERRORS_DUPLICATE_EMAIL
            });
        }
    }

    let profilePictureLink;

    if (filename && mimetype && path) {
        // User has updated their profile image
        profilePictureLink = `${UPLOADS_RELATIVE_PATH}${filename}`;
    }

    // Make sure the update does not contain any null values
    let update = {};
    update = extendIfPopulated(update, 'name', name);
    update = extendIfPopulated(update, 'email', email);
    update = extendIfPopulated(update, 'profilePictureLink', profilePictureLink);

    let newUser;

    try {
        newUser = yield findAndUpdate({
            collection: usersCollection,
            query: { _id: id },
            update
        });
    } catch (e) {
        logger.error(e, `Error updating user with id: ${id}`);

        return sendError({
            res,
            status: 500,
            message: 'Could not update user',
            errorKey: PROFILE_EDIT_ERRORS_GENERIC
        });
    }

    // Now that the value of the user has been changed, the front end needs a new token that reflects these changes
    const transformedNewUser = transformUserForOutput(newUser);
    const token = jwt.sign(transformedNewUser, process.env.JWT_SECRET);

    return res.json({
        user: transformedNewUser,
        token
    });
});

// TODO: More api route handlers here
