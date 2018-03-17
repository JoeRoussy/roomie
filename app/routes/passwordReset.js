import express from 'express';

import { required } from '../components/custom-utils';
import { getChildLogger } from '../components/log-factory';
import { sendEmail, setNewPassword } from '../controllers/passwordReset';

export default ({
    db = required('db'),
    baseLogger = required('baseLogger')
}) => {
    const passwordReset = express.Router();

    passwordReset.post('/', sendEmail({
        passwordResetsCollection: db.collection('passwordResets'),
        usersCollection: db.collection('users'),
        logger: getChildLogger({
            baseLogger,
            additionalFields: {
                module: 'api-password-reset-send-email'
            }
        })
    }));

    passwordReset.post('/newPassword', setNewPassword({
        passwordResetsCollection: db.collection('passwordResets'),
        usersCollection: db.collection('users'),
        logger: getChildLogger({
            baseLogger,
            additionalFields: {
                module: 'api-password-reset-set-new-password'
            }
        })
    }));

    return passwordReset;
}
