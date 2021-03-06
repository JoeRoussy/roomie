import express from 'express';

import { getChildLogger } from '../components/log-factory';
import { required } from '../components/custom-utils';
import {
    findChannels,
    postChannel,
    findMessages,
    postMessage,
    inviteUserToChannel,
    acceptInviteToChannel,
    leaveChannel
} from '../controllers/chat';

export default ({
    db = required('db'),
    baseLogger = required('baseLogger')
}) => {
    const channelsRouter = express.Router();

    //get all channels the user has access to
    channelsRouter.get('/', findChannels({
        channelsCollection: db.collection('channels'),
        usersCollection: db.collection('users'),
        logger: getChildLogger({
            baseLogger,
            additionalFields: {
                module: 'api-channels'
            }
        })
    }));

    //Create a channel
    //body.channelName = channel name
    channelsRouter.post('/', postChannel({
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

    //leave a channel put /:id/leave
    //body.userId = user to revove
    channelsRouter.put('/:id/leave', leaveChannel({
        channelsCollection: db.collection('channels'),
        logger: getChildLogger({
            baseLogger,
            additionalFields: {
                module: 'api-channels-leave'
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
