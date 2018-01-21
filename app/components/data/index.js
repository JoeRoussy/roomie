import {
    required,
    print,
    convertToObjectId,
    RuntimeError
} from '../custom-utils';

// Get listings based on an optional query
export const findListings = async({
    listingsCollection = required('listingsCollection'),
    query
}) => {
    try {
        return await listingsCollection.find(query).toArray();
    } catch (e) {
        throw new RuntimeError({
            err: e,
            msg: `Error getting listings for query: ${query}`
        });
    }
};
