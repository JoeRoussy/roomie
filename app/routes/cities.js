import express from 'express';

import { getChildLogger } from '../components/log-factory';
import { required } from '../components/custom-utils';
import { getCities } from '../controllers/cities';

export default ({
    db = required('db'),
    baseLogger = required('baseLogger')
}) => {
    const citiesRouter = express.Router();

    citiesRouter.get('/', getCities({
        logger: getChildLogger({
            baseLogger,
            additionalFields: {
                module: 'api-cities-search'
            }
        })
    }));

    return citiesRouter;
}
