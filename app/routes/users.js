import express from 'express';

import { getChildLogger } from '../components/log-factory';
import { required } from '../components/custom-utils';
import { createUser, editUser, deleteCurrentUser, fetchRecommenedRoommates, userSearch } from '../controllers/users';
import { canModifyUser, isAuthenticated } from '../controllers/utils';
import {
    singleFile as parseSingleFileUpload,
    error as handleImageUploadError,
    validate as validateImage
} from '../components/image-upload-middleware';

export default ({
    db = required('db'),
    baseLogger = required('baseLogger')
}) => {
    const userRouter = express.Router();

    userRouter.get('/', [
        isAuthenticated,
        userSearch({
            usersCollection: db.collection('users'),
            logger: getChildLogger({
                baseLogger,
                additionalFields: {
                    module: 'api-users-search'
                }
            })
        })
    ])

    userRouter.post('/', [
        parseSingleFileUpload('profilePic'),
        validateImage,
        createUser({
            usersCollection: db.collection('users'),
            verificationsCollection: db.collection('verifications'),
            logger: getChildLogger({
                baseLogger,
                additionalFields: {
                    module: 'api-users-create'
                }
            })
        }),
        handleImageUploadError({
            logger: getChildLogger({
                baseLogger,
                additionalFields: {
                    module: 'api-users-create-image-upload-errors'
                }
            })
        })
    ]);

    userRouter.put('/:id', [
        isAuthenticated,
        canModifyUser,
        parseSingleFileUpload('profilePic'),
        validateImage,
        editUser({
            usersCollection: db.collection('users'),
            logger: getChildLogger({
                baseLogger,
                additionalFields: {
                    module: 'api-users-edit'
                }
            })
        }),
        handleImageUploadError({
            logger: getChildLogger({
                baseLogger,
                additionalFields: {
                    module: 'api-users-edit-image-upload-errors'
                }
            })
        })
    ]);

    userRouter.delete('/me', [
        isAuthenticated,
        deleteCurrentUser({
            usersCollection: db.collection('users'),
            logger: getChildLogger({
                baseLogger,
                additionalFields: {
                    module: 'api-users-delete-current'
                }
            })
        })
    ]);

    userRouter.get('/:id/recommendedRoommates', [
        isAuthenticated,
        fetchRecommenedRoommates({
            roommateSurveysCollection: db.collection('roommateSurveys'),
            logger: getChildLogger({
                baseLogger,
                additionalFields: {
                    module: 'api-users-get-roommate-recommendations'
                }
            })
        })
    ]);


    return userRouter;
}
