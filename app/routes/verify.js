import express from 'express';

import { required } from '../components/custom-utils';
import { getChildLogger } from '../components/log-factory';
import { verifyEmail } from '../controllers/verification';

export default ({
    db = required('db'),
    baseLogger = required('baseLogger')
}) => {
    const verifyRouter = express.Router();

    verifyRouter.get('/email/:identifyer', verifyEmail({
        verificationsCollection: db.collection('verifications'),
        usersCollection: db.collection('users'),
        logger: getChildLogger({
            baseLogger,
            additionalFields: {
                module: 'api-verify-email'
            }
        })
    }));

    return verifyRouter;
}
