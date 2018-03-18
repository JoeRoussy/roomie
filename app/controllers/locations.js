import axios from 'axios';
import { wrap as coroutine } from 'co';
import jwt from 'jsonwebtoken';

import { required } from '../components/custom-utils';
import { sendError } from './utils';
import { provinces, cities } from '../../common/constants';

export const getProvinces = ({
    logger = required('logger', 'You must pass in a logger for this function to use')
}) => coroutine(function* (req, res) {
    // TODO: Retrieve the provinces from the DB.

    return res.json({
        provinces
    });
});

export const getCitiesForProvince = ({
    logger = required('logger', 'You must pass in a logger for this function to use')
}) => coroutine(function* (req, res) {
    // TODO: Make this retrieve from the DB.
    if (!provinces.find((province) => (province.value === req.params.province))) {
        logger.warn(req.body, 'Province does not exist.');

        return sendError({
            res,
            status: 400,
            message: 'Province does not exist.'
        });
    }

    let matchingCities = [];

    cities.forEach((city) => {
        if(city.province === req.params.province) {
            matchingCities.push(city);
        }
    });

    return res.json({
        cities: matchingCities
    });
});
