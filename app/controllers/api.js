import { wrap as coroutine } from 'co';

import { required, print, isEmpty, extendIfPopulated, convertToObjectId } from '../components/custom-utils';
import { getUserByEmail, getEmailConfirmationLink, removeUserById,getUsersById, getChannels,getMessagesByChannelId } from '../components/data';
import { generateHash as generatePasswordHash, comparePasswords } from '../components/authentication';
import { transformUserForOutput } from '../components/transformers';
import { sendSignUpMessage } from '../components/mail-sender';
import { sendError } from './utils';
import {
    insert as insertInDb,
    getById,
    findAndUpdate,
    deleteById
} from '../components/db/service';

export const createUser = ({
    usersCollection = required('usersCollection'),
    verificationsCollection = required('verificationsCollection'),
    logger = required('logger', 'You must pass in a logger for this function to use')
}) => coroutine(function* (req, res) {
    const {
        body: {
            name,
            email,
            password,
            userType
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
        USER_TYPE_TENANT,
        USER_TYPE_LANDLORD,
        SIGNUP_ERRORS_EXISTING_EMAIL,
        SIGNUP_ERRORS_GENERIC,
        SIGNUP_ERRORS_MISSING_VALUES,
        SIGNUP_ERRORS_INVALID_VALUES,
        UPLOADS_RELATIVE_PATH,
        DEFAULT_PROFILE_PICTURE_RELATIVE_PATH,
        JWT_SECRET
    } = process.env;

    // Start with the default profile picture
    let profilePictureLink = DEFAULT_PROFILE_PICTURE_RELATIVE_PATH;

    if (filename && mimetype && path) {
        // We have an image upload that we need to include in the saved user
        // NOTE: Validation middleware has already run by the time we get here so we can assume the image is valid
        profilePictureLink = `${UPLOADS_RELATIVE_PATH}${filename}`
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
                isEmailConfirmed: false,
                isInactive: false,
                profilePictureLink
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

    // Make a confirmation document tied to the current user to confirm the email.
    let emailConfirmationLink;
    try {
        emailConfirmationLink = yield getEmailConfirmationLink({
            verificationsCollection,
            user: savedUser
        });
    } catch (e) {
        logger.error(e, 'Error making confirmation document for new user');

        // Delete the user we made
        deleteById({
            collection: usersCollection,
            id: savedUser._id
        })
            .catch((e) => {
                logger.error({ user, err: e }, 'Could not delete user after failed confirmation document creation');
            });

        return sendError({
            res,
            status: 500,
            message: 'Could not sign up',
            errorKey: SIGNUP_ERRORS_GENERIC
        });
    }

    // Send a welcome email to the user
    try {
        yield sendSignUpMessage({
            user: savedUser,
            emailConfirmationLink
        });
    } catch (e) {
        // Log an error about not being able to send the email and try and delete the user we just made
        logger.error(e, 'Could not send welcome email to user');

        deleteById({
            collection: usersCollection,
            id: savedUser._id
        })
            .catch((e) => {
                logger.error({ user, err: e }, 'Could not delete user after failed email send during user creation');
            });

        return sendError({
            res,
            status: 500,
            message: 'Could not sign up',
            errorKey: SIGNUP_ERRORS_GENERIC
        });
    }

    // Now that the user has been saved, return a jwt encapsulating the new user (transformered for output)
    const token = jwt.sign(transformUserForOutput(savedUser), JWT_SECRET);

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

    // We can only update the name and profile picture using this route
    const {
        body: {
            name,
            password,
            oldPassword
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
        PROFILE_EDIT_ERRORS_GENERIC,
        PROFILE_EDIT_ERRORS_DUPLICATE_EMAIL,
        UPLOADS_RELATIVE_PATH,
        PROFILE_EDIT_ERRORS_INCORRECT_PASSWORD
    } = process.env;

    let hashedNewPassword;

    if (password) {
        // We need to make sure the old password was passed and it is correct
        if (!oldPassword) {
            logger.warn({ name, id }, 'Attempt to update password without providing old password');

            return sendError({
                res,
                status: 400,
                message: 'You must provide the current password of a user to change the password'
            });
        }

        // Get the user that goes with this id and compare the passwords
        let user;

        try {
            user = yield getById({
                collection: usersCollection,
                id
            });
        } catch (e) {
            logger.error(e, `Error fetching user with id: ${id} for checking old password before password update`);

            return sendError({
                res,
                status: 400,
                message: 'Could not update user',
                errorKey: PROFILE_EDIT_ERRORS_GENERIC
            });
        }

        let isPasswordValid;

        try {
            isPasswordValid = yield comparePasswords(oldPassword, user.password);
        } catch (e) {
            logger.error(e, 'Error during password comparison for password update');

            return sendError({
                res,
                status: 500,
                message: 'Could not update user',
                errorKey: PROFILE_EDIT_ERRORS_GENERIC
            });
        }

        if (!isPasswordValid) {
            return sendError({
                res,
                status: 400,
                message: 'Incorrect password',
                errorKey: PROFILE_EDIT_ERRORS_INCORRECT_PASSWORD
            });
        }

        // Now that we know everything is valid, hash the new password
        hashedNewPassword = yield generatePasswordHash(password);
    }

    let profilePictureLink;

    if (filename && mimetype && path) {
        // User has updated their profile image
        profilePictureLink = `${UPLOADS_RELATIVE_PATH}${filename}`;
    }

    // Make sure the update does not contain any null values
    let update = {};
    update = extendIfPopulated(update, 'name', name);
    update = extendIfPopulated(update, 'profilePictureLink', profilePictureLink);
    update = extendIfPopulated(update, 'password', hashedNewPassword);

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
export const deleteCurrentUser = ({
    usersCollection = required('usersCollection'),
    logger = required('logger', 'You need to pass in a logger for this function to use')
}) => coroutine(function* (req, res) {
    const {
        _id: id
    } = req.user;

    try {
        yield removeUserById({
            id,
            usersCollection
        });
    } catch (e) {
        logger.error(e, `Error removing user with id: ${id}`);

        return sendError({
            res,
            status: 500,
            message: 'Could not delete user'
        });
    }
    return res.json({
        user: transformUserForOutput(req.user)
    });
});


// TODO: More api route handlers here
