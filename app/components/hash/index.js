import crypto from 'crypto';

import { required } from '../custom-utils';

export const get = ({
    type = 'sha256',
    input = required('input')
})=> {
    const hashHelper = crypto.createHash(type);

    let preImage = null;

    if (typeof input === 'object') {
        preImage = JSON.stringify(input);
    } else if (typeof input !== 'string') {
        preImage = input.toString();
    } else {
        preImage = input;
    }

    return hashHelper
            .update(preImage)
            .digest('hex');
}
