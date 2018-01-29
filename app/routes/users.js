import express from 'express';

import { getChildLogger } from '../components/log-factory';
import { required } from '../components/custom-utils';
import { createUser, editUser } from '../controllers/api';
import { canModifyUser, isAuthenticated } from '../controllers/utils';

export default ({
    db = required('db'),
    baseLogger = required('baseLogger')
}) => {
    const userRouter = express.Router();

    userRouter.post('/', createUser({
        usersCollection: db.collection('users'),
        logger: getChildLogger({
            baseLogger,
            additionalFields: {
                module: 'api-users-create'
            }
        })
    }));

    userRouter.put('/:id', [
        isAuthenticated,
        canModifyUser,
        editUser({
            usersCollection: db.collection('users'),
            logger: getChildLogger({
                baseLogger,
                additionalFields: {
                    module: 'api-users-edit'
                }
            })
        })
    ]);

    return userRouter;
}
