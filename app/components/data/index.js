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
    const {
        bathrooms,
        bedrooms,
        furnished,
        keywords,
        maxPrice,
        minPrice,
        location = ''
    } = query;

    //Generate query
    const aggregationOperator = [
    ];

    let filter = {};
    if(minPrice){
        filter.price = {
            $gt: minPrice
        }
    }

    if(maxPrice){
        filter.price = {
            ...filter.price,
            $lt: maxPrice
        }
    }

    let orArgs = [];
    if(bathrooms){
        const bathroomArray = bathrooms.split(',').map(item => { return {bathroom:parseInt(item)} });
        orArgs = orArgs.concat(bathroomArray);
    }
    if(bedrooms){
        const bedroomArray = bedrooms.split(',').map(item => { return {bedroom:parseInt(item)} });
        orArgs = orArgs.concat(bedroomArray);
    }
    if(orArgs.length) filter.$or = orArgs;

    if(keywords){
        const keywordArray = keywords.split(' ');
        filter.keywords = {
            $all: keywordArray
        }
    }

    if(furnished){
        filter.furnished = furnished
    }

    aggregationOperator.push({
        $match: {
            $text: {
                $search: location
            },
            ...filter
        }
    });
    
    try {
        return await listingsCollection.aggregate(aggregationOperator).toArray();
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
