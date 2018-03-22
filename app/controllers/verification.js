import { wrap as coroutine } from 'co';
import jwt from 'jsonwebtoken';

import { findVerificationDocument } from '../components/data';
import { findAndUpdate } from '../components/db/service';
import { sendError } from './utils';
import { transformUserForOutput } from '../components/transformers';

export const verifyEmail = ({
    verificationsCollection = required('verificationsCollection'),
    usersCollection = required('usersCollection'),
    logger = required('logger', 'You must pass in a logging instance for this module to use')
}) => coroutine(function* (req, res) {
    const {
        FRONT_END_ROOT = required('FRONT_END_ROOT'),
        VERIFICATION_TYPES_EMAIL = required('VERIFICATION_TYPES_EMAIL')
    } = process.env;

    const {
        identifyer
    } = req.params;

    if (!identifyer) {
        // Reject malformed urls right away
        return sendError({
            res,
            status: 400,
            message: 'Missing identifyer url parameter'
        });
    }

    // First get the verification document we are referencing
    let verificationDocument;

    try {
        verificationDocument = yield findVerificationDocument({
            verificationsCollection,
            urlIdentifyer: identifyer,
            type: VERIFICATION_TYPES_EMAIL
        });
    } catch (e) {
        logger.error({ urlIdentifyer, err: e }, 'Error finding verification document.');

        return sendError({
            res,
            status: 500,
            message: 'Something went wrong while trying to complete your request'
        });
    }

    if (!verificationDocument) {
        // We did not find a verification document meaning the identifyer is invalid
        return sendError({
            res,
            status: 400,
            message: 'Invalid identifyer url parameter'
        });
    }

    let updatedUser;

    // Find the user defined by the verification document and mark them as confirmed
    try {
        updatedUser = yield findAndUpdate({
            collection: usersCollection,
            query: {
                _id: verificationDocument.userId
            },
            update: {
                isEmailConfirmed: true
            }
        });
    } catch (e) {
        logger.error(e, `Error updating user with id: ${verificationDocument.userId} as having their email confirmed.`);

        return sendError({
            res,
            status: 500,
            message: 'Something went wrong while trying to complete your request'
        });
    }

    // Mark the verificationDocument as completed
    try {
        yield findAndUpdate({
            collection: verificationsCollection,
            query: {
                _id: verificationDocument._id
            },
            update: {
                isCompeted: true
            }
        });
    } catch (e) {
        logger.error(e, `Error updating verification with id: ${verificationDocument._id} as being complete.`);

        return sendError({
            res,
            status: 500,
            message: 'Something went wrong while trying to complete your request'
        });
    }

    // Make a new jwt for the user
    const jwtToken = jwt.sign(transformUserForOutput(updatedUser), process.env.JWT_SECRET);

    // Everything has worked well so redirect to the homepage
    return res.redirect(`${FRONT_END_ROOT}/?newToken=${jwtToken}`);
});
