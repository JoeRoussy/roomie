import multer from 'multer';
import crypto from 'crypto';
import mime from 'mime-types';
import { wrap as coroutine } from 'co';

import { required } from '../custom-utils';
import validateImage from '../validate-image';

// Provides middleware to parse a file uploaded under on a field defined by name
// Parsed file will be avaiable in req.file
export const processFileUpload = ({
    name,
    storagePath,
    isMultipleUpload
}) => {
    if (!name) {
        throw new Error('You must pass in the name of the form field to inspect for the file');
    }

    const {
        UPLOADS_RELATIVE_FILE_PATH
    } = process.env;

    if (!UPLOADS_RELATIVE_FILE_PATH) {
        throw new Error('Missing env variable: UPLOADS_RELATIVE_FILE_PATH');
    }

    const destinationPath = storagePath || `${process.cwd()}${UPLOADS_RELATIVE_FILE_PATH}`;

    const storage = multer.diskStorage({
        destination(req, file, cb) {
            cb(null, destinationPath);
        },
        filename(req, file, cb) {
            const {
                mimetype
            } = file;

            if (!mimetype) {
                return cb('Could not find mimetype in parsed file');
            }

            crypto.pseudoRandomBytes(16, function(err, raw) {
                if (err) {
                    return cb(err, null);
                }

                const extension = mime.extension(mimetype);

                if (!extension) {
                    return cb({
                        message: `Could not convert mimetype: ${mimetype} to a file extension`,
                        key: process.env.ERRORS_IMAGE_PROCESSING
                    });
                }

                cb(null, `${raw.toString('hex')}${Date.now()}.${mime.extension(file.mimetype)}`)
            });
        }
    });

    const upload = multer({ storage });

    if (isMultipleUpload) {
        return upload.array(name);
    }

    return upload.single(name);
}

// Ensures an images is valid by inspecting the contents of the image itself. Prevents a client of lying about the mimetype
// NOTE: This function assumes there is already a parsed image file waiting in req.file
export const validate = coroutine(function* (req, res, next) {
    const {
        file: {
            path
        } = {}
    } = req;

    if (!path) {
        // This happens when we do not pass in an image to process
        return next();
    }

    let isValid;

    try {
        isValid = yield validateImage(path);
    } catch (e) {
        return next(e);
    }

    if (!isValid) {
        return next('Invalid image data');
    }

    return next();
});

// Handles errors related to image processing. Put this at the end of the middleware list for routes
// that process image uploads to catch errors thrown by the middleware in the function
// Also, for any other functions in the middleware list, return next(err) to throw to this function
export const error = ({
    logger = required('logger', 'You must pass in a logging instance for this function to use')
}) => (err, req, res, next) => {
    const {
        message,
        key
    } = err;

    if (!key || !message) {
        // Err is a string in this case
        logger.warn(err,  'Image uplaod middleware error');

        return res.status(500).json({
            error: true,
            message: 'Something went wrong processing your request'
        });
    }

    logger.warn({ key }, message);

    return res.status(500).json({
        error: true,
        message: 'Error processing image',
        errorKey: key
    });
}
