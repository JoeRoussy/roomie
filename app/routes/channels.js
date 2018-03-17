import express from 'express';

import { getChildLogger } from '../components/log-factory';
import { required } from '../components/custom-utils';
import {
    findChannels,
    postChannel,
    findMessages,
    postMessage,
    inviteUserToChannel,
    acceptInviteToChannel
} from '../controllers/api';

export default ({
    db = required('db'),
    baseLogger = required('baseLogger')
}) => {
    const channelsRouter = express.Router();

    //get all channels the user has access to
    channelsRouter.get('/', findChannels({
        channelsCollection: db.collection('channels'),
        logger: getChildLogger({
            baseLogger,
            additionalFields: {
                module: 'api-channels'
            }
        })
    }));

    //get all channels the user has access to
    channelsRouter.post('/', postChannels({
        channelsCollection: db.collection('channels'),
        logger: getChildLogger({
            baseLogger,
            additionalFields: {
                module: 'api-create-channel'
            }
        })
    }));

    //invite user(s) to a channel
    //body.userIds = array of user id strings
    channelsRouter.post('/:id/invites', inviteUserToChannel({
        channelsCollection: db.collection('channels'),
        usersCollection: db.collection('users'),
        logger: getChildLogger({
            baseLogger,
            additionalFields: {
                module: 'api-channels-invite'
            }
        })
    }));

    //accept invite put /:id/invites
    //body.accepted = true/false
    channelsRouter.put('/:id/invites', acceptInviteToChannel({
        channelsCollection: db.collection('channels'),
        logger: getChildLogger({
            baseLogger,
            additionalFields: {
                module: 'api-channels-invite'
            }
        })
    }));

    //get all messages in a channel
    channelsRouter.get('/:id', findMessages({
        messagesCollection: db.collection('messages'),
        logger: getChildLogger({
            baseLogger,
            additionalFields: {
                module: 'api-channels-get-messages'
            }
        })
    }));


    //post a message to a channel
    //body.message = message to post
    channelsRouter.post('/:id/messages', postMessage({
        channelsCollection: db.collection('channels'),
        messagesCollection: db.collection('messages'),
        logger: getChildLogger({
            baseLogger,
            additionalFields: {
                module: 'api-channels-post-message'
            }
        })
    }));

    return channelsRouter;
}
