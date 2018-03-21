
import axios from 'axios';
import { wrap as coroutine } from 'co';
import jwt from 'jsonwebtoken';

import { required, isEmpty, convertToObjectId } from '../components/custom-utils';
import { findListings,getUsersById, getChannels,getMessagesByChannelId } from '../components/data';
import { transformUserForOutput } from '../components/transformers';
import { sendError } from './utils';
import {
    insert as insertInDb,
    getById,
    findAndUpdate,
    deleteById
} from '../components/db/service';

export const findChannels = ({
    channelsCollection = required('channelsCollection'),
    usersCollection = required('usersCollection'),
    logger = required('logger', 'You must pass a logger for this function to use')
}) => coroutine(function* (req, res) {
    let channels;

    try {
        channels = yield getChannels({
            channelsCollection,
            query: {users: { $elemMatch: {"userId":convertToObjectId(req.user._id),"isActive":true} } }
        })
    } catch (e) {
        logger.error(e, 'Error finding channels');

        return sendError({
            res,
            status: 500,
            message: 'Error finding channels'
        });
    }

    //look through channels for unique user ids
    let userIds = {};
    channels.map((channel)=>{
        channel.users.map((user)=>{
            userIds[user.userId] = 1;
        })
    });
    userIds = Object.keys(userIds).map((userId)=>{return convertToObjectId(userId)});
    let users;
    //look up users from the channels
    try {
        users =  yield getUsersById({
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

    users = users.reduce((r,e)=>{
        r[e._id] = transformUserForOutput(e);
        return r;
    },{})

    channels = channels.map((channel)=>{
            channel.users = channel.users.map((user)=>{
                return {...users[user.userId],
                        ...user
                }
            })
            return channel;
        });

    return res.json({
        channels: channels
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
                "users": [{"userId":convertToObjectId(req.user._id),"acceptedInvite":true,"isActive":true}],
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
        logger.error('Error finding channel' );
        return sendError({
            res,
            status: 500,
            message: 'Error finding channel'
        });
    }

    //Validate user can post in channel
    const userCanPost = {canPost:false}
    channel.users.map((user)=>{
       if(user.userId.equals(req.user._id) && user.acceptedInvite && user.isActive){
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
        logger.error('Error finding channel' );
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
        logger.error('Error finding users' );
        return sendError({
            res,
            status: 500,
            message: 'Error finding users'
        });
    }
    const uniqueUsers = {}
    channel.users.forEach((user)=>{
        uniqueUsers[user.userId] = user;
    });
    //add the users to the users that exist to the channel
    let newUsers = userArray.map((user)=>{
        return {
            "userId":user._id,
            "acceptedInvite":false,
            "isActive":true
        }
    }).filter((user)=>{
        if(uniqueUsers[user.userId]){
            uniqueUsers[user.userId].isActive = true;
            uniqueUsers[user.userId].acceptedInvite = false;
            return false;
        }
        return true;
    });



    //make sure that users that are already in the chat are not reinvited
    const users2 = Object.values(uniqueUsers).concat(newUsers);
    //update the document in the database
    try {
        channel = yield findAndUpdate({
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
        logger.error('Error finding channel' );
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
                user.isActive = true;
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

export const leaveChannel = ({
    channelsCollection = required('channelsCollection'),
    logger = required('logger', 'You must pass a logger for this function to use')
}) => coroutine(function* (req, res) {

    if(!req.body.userId){
        return sendError({
            res,
            status: 500,
            message: 'Error Missing Parameter'
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

    //find the user to remove
    const user = channel.users.find((user)=>{
        return convertToObjectId(user.userId).equals(req.body.userId);
    });
    if(!user){
        logger.error('Error user is not a member of this channel' );
        return sendError({
            res,
            status: 500,
            message: 'Error user is not a member of this channel'
        });
    }

    let canLeave = false;
    const isAdmin = channel.admin.equals(req.user._id);
    canLeave = isAdmin || convertToObjectId(user.userId).equals(req.user._id);
    //canLeave is true if the current user is the channel admin or is the user to remove
    if(!canLeave){
        logger.error('Error user does not have authority to leave' );
        return sendError({
            res,
            status: 500,
            message: 'Error user does not have authority to leave'
        });
    }
    //set the selected user as inactive
    const users = channel.users.map((channelUser)=>{
        if(channelUser.userId === user.userId){
            channelUser.isActive = false;
            channelUser.acceptedInvite = false;
        }
        return channelUser;
    });
    //if the user being removed is the channel admin we need to transfer the admin
    if(convertToObjectId(channel.admin).equals(req.body.userId) && isAdmin){
        //transfer admin to first user
        //find the first active user
        const activeUser = channel.users.find((channelUser)=>{
            return !convertToObjectId(channelUser.userId).equals(req.body.userId) && channelUser.isActive;
        });
        //if there is an acive user make them the admin, otherwise leave the admin id blank
        if(activeUser){
            channel.admin = activeUser.userId;
        }else{
            channel.admin = "";
        }
        try {
            channel = yield findAndUpdate({
                collection: channelsCollection,
                query: {"_id":channel._id},
                update: {"users":users,"admin":channel.admin},
            });
        } catch (e) {
            logger.error(e, 'Error removing user from channel' );
            return sendError({
                res,
                status: 500,
                message: 'Error removing user from channel'
            });
        }
    }else{
        try {
            channel = yield findAndUpdate({
                collection: channelsCollection,
                query: {"_id":channel._id},
                update: {"users":users},
            });
        } catch (e) {
            logger.error(e, 'Error removing user from channel' );
            return sendError({
                res,
                status: 500,
                message: 'Error removing user from channel'
            });
        }
    }

    return res.json({
        channel: channel
    });
});
