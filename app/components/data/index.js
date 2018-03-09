import {
    required,
    print,
    convertToObjectId,
    RethrownError,
    getUniqueHash
} from '../custom-utils';
//import { get as getHash } from '../hash';
import { insert as insertInDb } from '../db/service';

import { findAndUpdate } from '../db/service';

// Get listings based on an optional query
export const findListings = async({
    listingsCollection = required('listingsCollection'),
    query
}) => {
    try {
        return await listingsCollection.find(query).toArray();
    } catch (e) {
        throw new RethrownError(e, `Error getting listings for query: ${JSON.stringify(query)}`);
    }
};

export const getUserByEmail = async({
    usersCollection = required('usersCollection'),
    email = required('email')
}) => {
    try {
        return await usersCollection.findOne({
            email,
            isInactive: {
                $ne: true
            }
        });
    } catch (e) {
        throw new RethrownError(e, `Error getting a user with the email ${email}`);
    }
}

// Makes a verification document and returns a link a user can use to verify their email
export const getEmailConfirmationLink = async({
    user = required('user'),
    verificationsCollection = required('verificationsCollection')
}) => {
    const {
        _id: userId
    } = user;

    const {
        ROOT_URL = required('ROOT_URL'),
        VERIFICATION_TYPES_EMAIL = required('VERIFICATION_TYPES_EMAIL')
    } = process.env;

    // const now = +new Date();
    // const userHash = await getHash({ input: user });

    const urlIdentifyer = await getUniqueHash(user);

    // Now save the verification document
    try {
        await insertInDb({
            collection: verificationsCollection,
            document: {
                urlIdentifyer,
                userId,
                isCompeted: false,
                type: VERIFICATION_TYPES_EMAIL
            }
        })
    } catch (e) {
        throw new RethrownError(e, `Error creating email verification document for user with id: ${userId}`);
    }

    // Return a link the user can use to confirm their profile
    return `${ROOT_URL}/api/verify/email/${urlIdentifyer}`;
};

export const findVerificationDocument = async({
    verificationsCollection = required('verificationsCollection'),
    urlIdentifyer = required('urlIdentifyer'),
    type = required('type')
}) => {
    try {
        return await verificationsCollection.findOne({
            urlIdentifyer,
            type
        });
    } catch (e) {
        throw new RethrownError(e, `Error finding verification document of type: ${type} with urlIdentifyer: ${urlIdentifyer}`)
    }
};

// Mark a user as inactive if they delete their profile
export const removeUserById = async({
    id = required('id'),
    usersCollection = required('usersCollection')
}) => {
    try {
        return await findAndUpdate({
            collection: usersCollection,
            query: {
                _id: id
            },
            update: {
                isInactive: true
            }
        });
    } catch (e) {
        throw new RethrownError(e, `Error removing user with id ${id}`);
    }
};

// Makes a password reset document and returns a link a user can use to reset their password
export const getPasswordResetLink = async({
    passwordResetsCollection = required('passwordResetsCollection'),
    user = required('user')
}) => {
    const {
        _id: userId
    } = user;

    const {
        FRONT_END_ROOT = required('FRONT_END_ROOT')
    } = process.env;

    const urlIdentifyer = await getUniqueHash(user);

    try {
        await insertInDb({
            collection: passwordResetsCollection,
            document: {
                userId: userId,
                urlIdentifyer
            }
        });
    } catch (e) {
        throw new RethrownError(e, `Error inserting password reset document for user with id: ${userId}`);
    }

    // Now make a link to reset the email
    return `${FRONT_END_ROOT}/?passwordResetToken=${urlIdentifyer}`;
};
