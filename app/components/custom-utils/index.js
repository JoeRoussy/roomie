import { ObjectId } from 'mongodb';
import { randomBytes } from 'crypto';
import { get as getHash } from '../hash';

export const required = (param, customMessage) => {
    if (typeof customMessage === 'string') {
        throw new Error(`could not find required param: ${param}. ${customMessage}`);
    } else {
        throw new Error(`${param} is required`);
    }
}

// Extends error to pass in a custom name and message while retaining the stack trace of the original error
// Extend this class when making a custom error
class ExtendedError extends Error {
    constructor(message) {
        super(message);

        this.name = this.constructor.name;
        this.message = message;

        Error.captureStackTrace(this, this.constructor);
    }
}

// We use this class to normalize errors for modules at higher levels of abstractions.
// If a DB error occurs, we don't want that to just bubble up to a controller. Using this class
// we can add a message about what is going on at mid levels of abstraction to make error handling
// easier. This also lets modules at mid levels of abstractino have their own error interface instead of
// throwing seemingly obscure errors. This also lets us take an error, log something, and rethrow it without
// losing the stack trace.
// Exmaple Usage:
// Given an error in the current scope. Rethrow the same error using:
//     throw RethrownError(error, 'Something messed up happened but you reading this understands because I am not a wired DB error')
export class RethrownError extends ExtendedError {
    constructor(error, message) {
        super(message);

        if (!error) {
            throw new Error('RethrownError requires a message and error');
        }

        this.original = error;
        const messageLines =  (this.message.match(/\n/g)||[]).length + 1;

        // Remove all but the first line of this new stack and replace it with the old stack
        // so only the new message appears on top of the entire old stack
        this.stack = `${this.stack.split('\n').slice(0, messageLines + 1).join('\n')}\n${error.stack}`;
    }
}


export const print = (obj, message) => {
    if (message) {
        console.log(message);
    }

    console.log(JSON.stringify(obj, null, 4));
}

export const stringify = obj => JSON.stringify(obj, null, 4);

// Takes a list and intersects and intersects it with another list. However, if the
// first list is empty, we return the second list.
// Can pass in a comparator for array of objects. The comparator will be called with the source
// array and an element from the target array and should return if the element is in the source array
export const intersectIfPopulated = (target, source, comparator) => {
    if (!target.length) {
        return source;
    }

    return target.filter(x => {
        if (comparator && typeof comparator === 'function') {
            return comparator(x, source);
        }

        return source.indexOf(x) !== -1;
    });
}

export const convertToObjectId = id => {
    if (typeof id === 'number' || typeof id === 'string') {
        return ObjectId(id);
    }

    return id;
}

// Returns a function to sort an array of objects by key
// Objects in the key must be strings or numbers (comparable using '<' and '>')
export const sortByKey = key => (a, b) => {
    if (a[key] > b[key]) {
        return 1;
    }

    if (a[key] < b[key]) {
        return -1;
    }

    return 0;
}

// Uses the createdAt property in each object
export const sortByDate = (a, b) => b.createdAt - a.createdAt;

// Returns a fully qualified URL with a given path using the slug in a req object
export const buildUrl = (req, path) => `${req.protocol}://${req.get('host')}${path}`;

// Takes an array and returns all the unique values
export const unique = array => {
    let result = [];

    for (let i = 0; i < array.length; i++) {
        if(!result.includes(array[i])) {
            result.push(array[i]);
        }
    }

    return result;
};

// Retuns a regex for a plain language query that may contain multiple words using and logic
// NOTE: For compatability with mongodb, this function returns a string and not a RegExp object
export const getRegex = query => {
    let regex = '';
    const words = query.split(' ');

    if (words.length === 1) {
        // If there is only 1 word in the name query, use that
        regex = words[0];
    } else {
        // If there are multiple words in the name query, use and logic in the regex
        regex = words.reduce((r, word) => `${r}(?=.*${word})`, '');
    }

    return regex;
}

// Allows for inline fetching of an env variable without having to worry about weather the
// .env file has been parsed yet (assuming this function is called after the .env file is parsed).
// This avoids the paradigm of destructuring process.env at the top of a module which is sure
// to fail as the .env file would not have been parsed yet
export const getEnvVariable = (key) => {
    const {
        [key]: value
    } = process.env;

    if (!value) {
        throw new Error(`${key} must be set in the .env file`);
    }

    return value;
}

// Genertic function to see if instances of various types are empty
// undefined and null always return true
// objects with key lengths of 0 return true (this includes arrays)
// the empty string returns true
// as a last resort, a boolean coersion of the object is returned
export const isEmpty = (data) => {
    if (typeof data === 'undefined') {
        return true;
    } else if (data === null) {
        return true;
    } else if (typeof data === 'object') {
        // NOTE: This works for standard objects and arrays
        return Object.keys(data).length === 0;
    } else if (typeof data === 'string') {
        return data.length === 0;
    } else {
        return !data;
    }
}

// Generic function to convert a string of true or false to a boolean.
export const convertToBoolean = (value) => (value == 'true')

// Generic function to convert a string for price to a number with two decimal places.
export const convertToNumber = (value) => (+value)

// if passed a truth value, will return an extended version of obj with value set under the provided key
export const extendIfPopulated = (obj, key, value) => {
    if (typeof value !== 'undefined' && value !== null) {
        return {
            ...obj,
            [key]: value
        }
    }

    return obj;
}

// Returns a hash of an object that includes a random value and appends the date on the end to protect against collisions
export const getUniqueHash = async (obj) => {
    const objToHash = {
        ...obj,
        randomValue: randomBytes(16).toString('hex')
    };

    const now = +new Date();
    const hash = await getHash({ input: objToHash });

    return hash + now;
};
