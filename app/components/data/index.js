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
        // TODO: Replace with RethrownError
        throw new RethrownError(e, `Error getting listings for query: ${JSON.stringify(query)}`);
    }
};
