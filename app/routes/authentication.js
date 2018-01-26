import express from 'express';
import { required } from '../components/custom-utils';

export default ({
    app = required('app'),
    db = required('db'),
    baseLogger = required('baseLogger')
}) => {
    const router = express.Router();

    // TODO: Login and logout handlers here
    // But.... do we even need to log out?
    router.post('/login', (req, res) => {
        console.log(req.body);

        setTimeout(() => {
            return res.json({
                token: '12345'
            })
        }, 2000);
    });

    app.use(router);
}
