import express from 'express';
import { getChildLogger } from '../components/log-factory';
import { isAuthenticated, isLandlord, canModifyListing } from '../controllers/utils';
import { required } from '../components/custom-utils';
import { createListing, getListings, getListingById, updateListing } from '../controllers/listings';
import {
    processFileUpload as parseImageUpload,
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
        parseImageUpload({
            name: 'images',
            isMultipleUpload: true
        }),
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

    listingsRouter.put('/:id', [
        isAuthenticated,
        isLandlord,
        parseImageUpload({
            name: 'images',
            isMultipleUpload: true
        }),
        canModifyListing({
            listingsCollection: db.collection('listings'),
            logger: getChildLogger({
                baseLogger,
                additionalFields: {
                    module: 'api-listings-user-can-modify-listing'
                }
            })
        }),
        updateListing({
            listingsCollection: db.collection('listings'),
            logger: getChildLogger({
                baseLogger,
                additionalFields: {
                    module: 'api-listings-update-listing'
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
