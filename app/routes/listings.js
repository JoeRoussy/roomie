import express from 'express';
import { getChildLogger } from '../components/log-factory';
import { isAuthenticated, isLandlord } from '../controllers/utils';
import { required } from '../components/custom-utils';
import { createListing, getListings, getListingById } from '../controllers/listings';
import {
    singleFile as parseSingleFileUpload,
    error as handleImageUploadError,
    validate as validateImage
} from '../components/image-upload-middleware';

export default ({
    db = required('db'),
    baseLogger = required('baseLogger')
}) => {
    const listingsRouter = express.Router();

    listingsRouter.get('/', getListings({
        listingsCollection: db.collection('listings'),
        logger: getChildLogger({
            baseLogger,
            additionalFields: {
                module: 'api-listings-search'
            }
        })
    }));

    listingsRouter.get('/:id', getListingById({
        listingsCollection: db.collection('listings'),
        logger: getChildLogger({
            baseLogger,
            additionalFields: {
                module: 'api-listings-get-single-listing'
            }
        })
    }));

    listingsRouter.post('/', [
        isAuthenticated,
        isLandlord,
        parseSingleFileUpload('images'),
        createListing({
            listingsCollection: db.collection('listings'),
            logger: getChildLogger({
                baseLogger,
                additionalFields: {
                    module: 'api-listings-create-listing'
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

    return listingsRouter;
}
