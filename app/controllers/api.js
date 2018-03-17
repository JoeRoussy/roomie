import { wrap as coroutine } from 'co';
import jwt from 'jsonwebtoken';

import { required, print, isEmpty, extendIfPopulated, convertToObjectId } from '../components/custom-utils';
import { findListings, getUserByEmail, getEmailConfirmationLink, removeUserById,getUsersById, getChannels,getMessagesByChannelId } from '../components/data';
import { generateHash as generatePasswordHash, comparePasswords } from '../components/authentication';
import { transformUserForOutput } from '../components/transformers';
import { sendSignUpMessage } from '../components/mail-sender';
import { sendError } from './utils';
import { isPrice, isText } from '../../common/validation';
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
        file: {
            filename,
            mimetype,
            path
        } = {}
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
export const findChannels = ({
    channelsCollection = required('channelsCollection'),
    logger = required('logger', 'You must pass a logger for this function to use')
}) => coroutine(function* (req, res) {
    let result;

    try {
        result = yield getChannels({
            channelsCollection,
            query: {users: { $elemMatch: {"userId":convertToObjectId(req.user._id)} } }
        })
    } catch (e) {
        logger.error(e, 'Error finding channels');

        return sendError({
            res,
            status: 500,
            message: 'Error finding channels'
        });
    }

    return res.json({
        channels: result
    });
});

export const postChannel = ({
    channelsCollection = required('channelsCollection'),
    logger = required('logger', 'You must pass a logger for this function to use')
}) => coroutine(function* (req, res) {
    let channel;
    try {
        channel = yield insertInDb({
            collection: channelsCollection,
            document: {
                "name": req.body.channelName,
                "users": [{"userId":convertToObjectId(req.user._id),"acceptedInvite":true}],
                "admin": convertToObjectId(req.user._id)
            },
            returnInsertedDocument: true
        });
    } catch (e) {
        logger.error(e, 'Error creating channel');

        return sendError({
            res,
            status: 500,
            message: 'Error creating channel'
        });
    }

    return res.json({
        channel: channel
    });
});

export const findMessages = ({
    messagesCollection = required('messagesCollection'),
    logger = required('logger', 'You must pass a logger for this function to use')
}) => coroutine(function* (req, res) {
    const {
        id: channelId
    } = req.params;

    let result;

    try {
        result = yield getMessagesByChannelId({
            messagesCollection,
            query: { channelId: convertToObjectId(channelId) }
        })
    } catch (e) {
        logger.error(e, 'Error finding messages');

        return sendError({
            res,
            status: 500,
            message: 'Error finding mesages'
        });
    }

    return res.json({
        messages: result
    });
});

export const postMessage = ({
    channelsCollection = required('channelsCollection'),
    messagesCollection = required('messagesCollection'),
    logger = required('logger', 'You must pass a logger for this function to use')
}) => coroutine(function* (req, res) {
    let message;
    if(!req.body.channelId || isEmpty(req.body.channelId))
    {
        return  sendError({
            res,
            status: 500,
            message: 'Channel ID is missing or empty'
        });
    }
    if(!req.body.message || isEmpty(req.body.message)){
        return  sendError({
            res,
            status: 500,
            message: 'Sending blank messages is not allowed'
        });
    }

    //Get the channel to update from the database
    let channel;
    try {
        channel =  yield getById({
            'collection':channelsCollection,
            'id':req.params.id
        });
    } catch (e) {
        logger.error(e, 'Error finding channel' );
        return sendError({
            res,
            status: 500,
            message: 'Error finding channel'
        });
    }
    //if the channel was not found
    if(!channel){
        logger.error(e, 'Error finding channel' );
        return sendError({
            res,
            status: 500,
            message: 'Error finding channel'
        });
    }

    //Validate user can post in channel
    const userCanPost = {canPost:false}
    channel.users.map((user)=>{
       if(user.userId.equals(req.user._id) && user.acceptedInvite){
           return userCanPost.canPost=true;
       }
   });

   if(!userCanPost.canPost){
       logger.error('Error user is not allowed to post in channel' );
       return sendError({
           res,
           status: 500,
           message: 'Error user is not allowed to post in channel'
       });
   }

    try {
        message = yield insertInDb({
            collection: messagesCollection,
            document: {
                "channelId" :  convertToObjectId(req.body.channelId),
                "userId" : convertToObjectId(req.user._id),
                "body" : req.body.message
            },
            returnInsertedDocument: true
        });
    } catch (e) {
        logger.error(e, 'Error saving message to database');

        return sendError({
            res,
            status: 500,
            message: 'Error sending mesage'
        });
    }

    return res.json({
        message: message
    });
});

export const inviteUserToChannel = ({
    channelsCollection = required('channelsCollection'),
    usersCollection = required('usersCollection'),
    logger = required('logger', 'You must pass a logger for this function to use')
}) => coroutine(function* (req, res) {
    //Get the channel to update from the database
    let channel;
    try {
        channel =  yield getById({
            'collection':channelsCollection,
            'id':req.params.id
        });
    } catch (e) {
        logger.error(e, 'Error finding channel' );
        return sendError({
            res,
            status: 500,
            message: 'Error finding channel'
        });
    }
    //if the channel was not found
    if(!channel){
        logger.error(e, 'Error finding channel' );
        return sendError({
            res,
            status: 500,
            message: 'Error finding channel'
        });
    }
    //check if the user if the admin of the channel
    if(!channel.admin.equals(req.user._id)){
        return sendError({
            res,
            status: 500,
            message: 'Only channel admins can invite users'
        });
    }
    //find the users to invite in the database
    const userIds = req.body.userIds.map((userId)=>{return convertToObjectId(userId)});
    let userArray;
    try {
        userArray =  yield getUsersById({
            usersCollection,
            ids: userIds
        });
    } catch (e) {
        logger.error(e, 'Error finding users' );
        return sendError({
            res,
            status: 500,
            message: 'Error finding users'
        });
    }

    //check if the user to invite exist
    if(userArray.length < 1){
        logger.error(e, 'Error finding users' );
        return sendError({
            res,
            status: 500,
            message: 'Error finding users'
        });
    }
    //add the users to the users that exist to the channel
    const users = channel.users.concat(userArray.map((user)=>{
        return {
            "userId":user._id,
            acceptedInvite:false
        }
    }));

    //make sure that users that are already in the chat are not reinvited
    const uniqueIds = {};
    const users2 = users.filter((user)=>{
        if(uniqueIds[user.userId]){
            return false;
        }
        uniqueIds[user.userId] = true;
        return true;
    });

    //update the document in the database
    try {
        channel = findAndUpdate({
            collection: channelsCollection,
            query: {"_id":channel._id},
            update: {"users":users2}
        });
    } catch (e) {
        logger.error(e, 'Error adding users to channel' );
        return sendError({
            res,
            status: 500,
            message: 'Error adding users to channel'
        });
    }

    return res.json({
        channel: channel
    });
});

export const acceptInviteToChannel = ({
    channelsCollection = required('channelsCollection'),
    logger = required('logger', 'You must pass a logger for this function to use')
}) => coroutine(function* (req, res) {
    //Get the channel to update from the database
    let channel;
    try {
        channel =  yield getById({
            'collection':channelsCollection,
            'id':req.params.id
        });
    } catch (e) {
        logger.error(e, 'Error finding channel' );
        return sendError({
            res,
            status: 500,
            message: 'Error finding channel'
        });
    }
    //if the channel was not found
    if(!channel){
        logger.error(e, 'Error finding channel' );
        return sendError({
            res,
            status: 500,
            message: 'Error finding channel'
        });
    }

    //check if user has been invited to the channel
    let userFound = false;
    let users;
    if(req.body.accepted){
        //if they user accepted set the accepted flag to true
        users = channel.users.map((user)=>{
            if(user.userId.equals(req.user._id) && !user.acceptedInvite){
                user.acceptedInvite = true;
                userFound = true;
            }
            return user;
        });
    }else{
        //if the user declined then remove them from the user list
        users = channel.users.filter((user)=>{
            if(user.userId.equals(req.user._id) && !user.acceptedInvite){
                userFound = true;
                return false;
            }
            return true
        });
    }

    if(!userFound){
        return sendError({
            res,
            status: 500,
            message: 'Error user has not been invited to this channel or has already accepted the invite'
        });
    }

    //update the document in the database
    try {
        channel = yield findAndUpdate({
            collection: channelsCollection,
            query: {"_id":channel._id},
            update: {"users":users},
        });
    } catch (e) {
        logger.error(e, 'Error adding users to channel' );
        return sendError({
            res,
            status: 500,
            message: 'Error adding users to channel'
        });
    }

    return res.json({

        channel: channel
    });
});

// TODO: More api route handlers here
