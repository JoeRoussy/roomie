import {
    required,
    print,
    convertToObjectId,
    RethrownError
} from '../custom-utils';

// Get listings based on an optional query
export const findListings = async({
    listingsCollection = required('listingsCollection'),
    query
}) => {
    try {
        return await listingsCollection.find(query).toArray();
    } catch (e) {
        throw new RethrownError(e, `Error getting listings for query: ${JSON.stringify(query)}`);
    }
};

export const getUserByEmail = async({
    usersCollection = required('usersCollection'),
    email = required('email')
}) => {
    try {
        return await usersCollection.findOne({ email });
    } catch (e) {
        throw new RethrownError(e, `Error getting a user with the email ${email}`);
    }
}

export const findChannels = async({
    channelsCollection = required('channelsCollection'),
    query
}) => {
    try {
        return await listingsCollection.find(query).toArray();
    } catch (e) {
        throw new RethrownError(e, `Error getting listings for query: ${JSON.stringify(query)}`);
    }
};
