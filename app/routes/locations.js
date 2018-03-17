import express from 'express';
import { getChildLogger } from '../components/log-factory';
import { required } from '../components/custom-utils';

import { getProvinces , getCitiesForProvince} from '../controllers/api';

export default ({
    baseLogger = required('baseLogger')
}) => {
    const locationsRouter = express.Router();

    locationsRouter.get('/provinces', getProvinces({
        logger: getChildLogger({
            baseLogger,
            additionalFields: {
                module: 'api-locations-get-provinces'
            }
        })
    }));

    locationsRouter.get('/:province/cities', getCitiesForProvince({
        logger: getChildLogger({
            baseLogger,
            additionalFields: {
                module: 'api-locations-get-cities-for-province'
            }
        })
    }));

    return locationsRouter;
}
