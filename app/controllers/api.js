import { wrap as coroutine } from 'co';
import jwt from 'jsonwebtoken';

import { required, print, isEmpty, extendIfPopulated, convertToObjectId } from '../components/custom-utils';
import { findListings, getUserByEmail, getUsersById, getChannels,getMessages } from '../components/data';
import { insert as insertInDb, getById, findAndUpdate } from '../components/db/service';
import { generateHash as generatePasswordHash } from '../components/authentication';
import { transformUserForOutput } from '../components/transformers';
import { sendError } from './utils';

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
        result = yield getMessages({
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
    console.log(req.body);
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
    console.log(channel);
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
                "userName" : req.user._id,
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
