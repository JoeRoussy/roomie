import bcrypt from 'bcrypt';
import { wrap as coroutine } from 'co';
import { getDocById, getUserByEmail } from '../data';
import { insert as saveToDb } from '../db/service';
import passportLocal from 'passport-local';
import { required } from '../custom-utils';

const {
    AUTH_SALT_ROUNDS,
    AUTH_LOCAL_LOGIN_STRATEGY
} = process.env;

if (!AUTH_SALT_ROUNDS || !AUTH_LOCAL_LOGIN_STRATEGY) {
    throw new Error('Missing env variables for the authentication component: AUTH_SALT_ROUNDS, AUTH_LOCAL_LOGIN_STRATEGY');
}

// TODO: Do these functions really need to be exported?
export const generateHash = async (password) => await bcrypt.hash(password, AUTH_SALT_ROUNDS);

export const comparePasswords = async (password, hash) => await bcrypt.compare(password, hash);

export default ({
    passport = required('passport'),
    db = required('db')
}) => {
    const LocalStrategy = passportLocal.Strategy;

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(coroutine(function* (id, done) {
        let user = null;

        try {
            user = yield getDocById({
                collection: db.collection('users'),
                id
            });
        } catch (e) {
            return done(e, null);
        }

        return done(null, user);
    }));

    passport.use(AUTH_LOCAL_LOGIN_STRATEGY, new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
    }, coroutine(function* (email, password, done) {
        let user = null;

        try {
            user = yield getUserByEmail({
                usersCollection: db.collection('users'),
                email
            });
        } catch (e) {
            return done(e);
        }

        if (!user) {
            // TODO: We will need to handle errors differently
            return done(null, false, {
                errorKey: 'TODO...'
            });
        }

        let isValidPassword = false;

        try {
            isValidPassword = yield comparePasswords(password, user.password);
        } catch (e) {
            return done(e);
        }

        if (!isValidPassword) {
            // TODO: We will need to handle errors differently
            return done(null, false, {
                errorKey: 'TODO...'
            });
        }

        return done(null, user);
    })));
}
