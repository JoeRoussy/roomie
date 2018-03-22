import { wrap as coroutine } from 'co';
import moment from 'moment';
import { required, convertToObjectId } from '../components/custom-utils';
import { sendError } from './utils';
import { isPrice } from '../../common/validation';
import { sendLeaseInviteEmail } from '../components/mail-sender';
import {
    getListingsByOwner,
    getLeasesByOwner,
    getListingByIdWithOwnerPopulated,
    getLeaseEmailIdentifiersForTenants,
    getLeaseAndTenantFromEncryption
} from '../components/data';
import {
    insert as insertInDb,
    getById,
    findAndUpdate,
    deleteById
} from '../components/db/service';


export const getMyListings = ({
    listingsCollection = required('listingsCollection'),
    leasesCollection = required('leasesCollection'),
    logger = required('logger', 'You must pass a logger for this function to use')
}) => coroutine(function* (req, res) {
    let result;

    try {
        result = yield getListingsByOwner({
            listingsCollection,
            ownerId: req.user._id
        });
    } catch (e) {
        logger.error(e, `Error finding listings for user ${req.user._id}`);

        return sendError({
            res,
            status: 500,
            message: 'Error finding listings for owner.'
        });
    }

    let leaseResults;
    try{
        leaseResults = yield getLeasesByOwner({
            leasesCollection,
            ownerId: convertToObjectId(req.user._id)
        })
    } catch (e){
        logger.error(e, `Error finding leases for user ${req.user._id}`);
        return sendError({
            res,
            status: 500,
            message: 'Error finding leases for owner.'
        });
    }

    return res.json({
        listings: result,
        leases: leaseResults
    });
});


export const deleteMyListing = ({
    listingsCollection = required('listingsCollection'),
    logger = required('logger', 'You must pass a logger for this function to use')
}) => coroutine(function* (req, res) {
    if (!req.params.id) {
        // Something weird has happened...
        logger.error('No id in parameters for delete listing by id');

        return res.status(400).json({
            error: true,
            message: `No id provided`
        });
    }

    const listingId = req.params.id;
    const userId = req.user._id;

    let result;

    try {
        result = yield getListingByIdWithOwnerPopulated({
            listingsCollection,
            id: convertToObjectId(listingId)
        });
    } catch (e) {
        logger.error(e,`Error getting listing id ${listingId} with owner ${userId}`);

        return sendError({
            res,
            status: 500,
            message: 'Error finding listing for owner.'
        });
    }

    // Check the owner id matches the user id
    if (result.ownerId.equals(convertToObjectId(userId)))
    {
        try {
            result = yield deleteById({
                collection: listingsCollection,
                id: listingId
            })
        } catch (e) {
            logger.error(e,`Error deleting listing id ${listingId} with owner ${userId}`);

            return sendError({
                res,
                status: 500,
                message: 'Error deleting listing for owner.'
            });
        }
    }
    else {
        return sendError({
            res,
            status: 401,
            message: 'Not owner of listing'
        });
    }

    return res.json({
        listings: result
    });
});


export const createLease = ({
    listingsCollection = required(listingsCollection),
    leasesCollection = required(leasesCollection),
    usersCollection = required(usersCollection),
    logger = required('logger', 'You must pass a logger for this function')
})=> coroutine(function* (req, res) {
    const {
        user: {
            _id: userId
        } = { }
    } = req;
    console.log(req.body);

    const {
        tenantIds: tenants,
        listing: listingId,
        start,
        end,
        price
    } = req.body;

    // TODO: Make sure req.user is the owner of the listing in question

    //Perform Basic Validation
    if(!userId){
        logger.error('Error no userId provided')
        return sendError({
            res,
            status: 400,
            message: 'No userId provided'
        })
    }

    if(!tenants){
        logger.error('Error no tenants provided')
        return sendError({
            res,
            status: 400,
            message: 'No tenants provided'
        })
    }

    if(!listingId){
        logger.error('Error no listings provided')
        return sendError({
            res,
            status: 400,
            message: 'No listings provided'
        })
    }

    if(!start){
        logger.error('Error no start provided')
        return sendError({
            res,
            status: 400,
            message: 'No start provided'
        })
    }

    if(!end){
        logger.error('Error no end provided')
        return sendError({
            res,
            status: 400,
            message: 'No end provided'
        })
    }

    if(!price){
        logger.error('Error no price provided')
        return sendError({
            res,
            status: 400,
            message: 'No price provided'
        })
    }

    //Check if tenants exist
    if(!Array.isArray(tenants) || tenants.length < 1){
        logger.error('Error tenants is not an array of length > 0')
        return sendError({
            res,
            status: 400,
            message: 'Tenants is not an array of length > 0'
        });
    }
    const getAllTenants = tenants.map(p=> getById({
        collection: usersCollection,
        id: convertToObjectId(p)
    }));
    let tenantsInLease;
    try{
        tenantsInLease = yield Promise.all(getAllTenants);
    } catch (e){
        logger.error(e, 'Error finding tenants in user collection');
        return sendError({
            res,
            status:500,
            message: 'Error finding tenants in user collection'
        });
    }

    if(tenantsInLease.some(x => !x)){
        logger.error('Found invalid tenant in lease');
        return sendError({
            res,
            status: 400,
            message: 'tenant not found'
        })
    }

    //Check if listing exists
    let listingInLease;
    try{
        listingInLease = yield getById({
            collection: listingsCollection,
            id: convertToObjectId(listingId)
        });
    } catch (e){
        logger.error(e, 'Error finding listing in db')
        return sendError({
            res,
            status: 500,
            message: 'listing not found'
        });
    }
    if(!listingInLease){
        return sendError({
            res,
            status: 404,
            message: 'Listing not found'
        })
    }

    //Start and end validation
    const startMoment = moment(start);
    const endMoment = moment(end);
    if(startMoment.isAfter(endMoment)){
        logger.error('Error Start date is after end date');
        return sendError({
            res,
            status: 400,
            message: 'Start date is after end date'
        });
    }

    //Price validation
    if(!isPrice(price)){
        logger.error('Error price is invalid');
        return sendError({
            res,
            status: 400,
            message: 'Price is invalid'
        });
    }

    //Create the Lease
    let lease;
    const tenantsWithStatus = tenantsInLease.map(t => ({
        userId: t._id,
        confirmed: undefined,
        name: t.name
    }));

    const leaseObject = {
        listingId: listingInLease._id,
        title: listingInLease.name,
        ownerId: listingInLease.ownerId,
        tenants: [...tenantsWithStatus],
        start: new Date(startMoment.toISOString()),
        end: new Date(endMoment.toISOString()),
        price: price
    }

    try {
        lease = yield insertInDb({
            collection: leasesCollection,
            document: leaseObject,
            returnInsertedDocument: true
        });
    } catch(e){
        logger.error(e, 'Error inserted new lease into leases collection');
        return sendError({
            res,
            status:500,
            message: 'Error inserting new lease into leases collection'
        });
    }


    //Update the listing
    let updatedListing;
    try {
        updatedListing = yield findAndUpdate({
            collection: listingsCollection,
            query: {_id: convertToObjectId(listingInLease._id)},
            update: {isCurrentlyLeased: true}
        })
    } catch (e) {
        logger.error(e, 'Error updating listing to leased')
        return sendError({
            res,
            status:500,
            message: 'error udpating listing to leased status'
        });
    }

    // Get the verification identifiers
    const tenantEmailIdentifiers = getLeaseEmailIdentifiersForTenants({
        tenantIds: tenants,
        leaseId: lease._id
    });

    // Send the emails
    const emailRequests = tenantsInLease.map((tenant) => sendLeaseInviteEmail({
        user: tenant,
        identifier: tenantEmailIdentifiers[tenant._id.toString()],
        lease,
        listing: listingInLease,
        landlordName: req.user.name
    }))

    try {
        yield Promise.all(emailRequests);

        //Return result
        return res.json({
            lease
        });
    } catch (e) {
        logger.error(e, `Failed to send lease email requests`);

        return sendError({
            res,
            status: 500,
            message: 'error udpating listing to leased status'
        });
    }
});

export const updateLease = ({
    listingsCollection = required(listingsCollection),
    leasesCollection = required(leasesCollection),
    usersCollection = required(usersCollection),
    logger = required('logger', 'You must pass a logger for this function')
})=> coroutine(function* (req, res) {
    //TODO
    //Extract information about user accepting or declining lease
    const {
        identifier
    } = req.params;

    const {
        response
    } = req.query;

    //decrypt it
    const decryptedIdentifier = getLeaseAndTenantFromEncryption(identifier);

    console.log("identifier", identifier);

    console.log('decryptedIdentifier', decryptedIdentifier);

    const userId = decryptedIdentifier.tenantId;
    const leaseId = decryptedIdentifier.leaseId;
    const confirmed = response === 'accept';

    console.log('userId', userId);

    //Perform Validation
    if(!userId){
        logger.error('Error bad user in request')
        return sendError({
            res,
            status:400,
            message:'Error bad user in request'
        })
    }

    if(!leaseId){
        logger.error('Error bad lease in request')
        return sendError({
            res,
            status:400,
            message:'Error bad lease in request'
        })
    }

    if(!response){
        logger.error('Error bad response in request')
        return sendError({
            res,
            status:400,
            message:'Error bad response in request'
        })
    }

    let userValidation;
    try {
        userValidation = yield getById({
            collection: usersCollection,
            id: convertToObjectId(userId)
        })
    } catch(e) {
        logger.error(e, 'Error retrieving user in database');
        return sendError({
            res,
            status:500,
            message: 'Error retrieving user in database'
        });
    }

    let leaseValidation;
    try {
        leaseValidation = yield getById({
            collection: leasesCollection,
            id: convertToObjectId(leaseId)
        })
    } catch(e) {
        logger.error(e, 'Error retrieving lease in database');
        return sendError({
            res,
            status:500,
            message: 'Error retrieving lease in database'
        });
    }

    //Update the lease
    let result;
    try {
        const updatedTenants = leaseValidation.tenants.map(user => {
            if(user.userId.equals(convertToObjectId(userId))){
                return {
                    ...userId,
                    confirmed
                }
            }
            return user;
        });

        result = yield findAndUpdate({
            collection: leasesCollection,
            query: { _id: leaseId },
            update: { updatedTenants }
        })
    } catch (e) {
        logger.error(e, 'Error updating the tenant conformation for lease')
        return sendError({
            res,
            status: 500,
            message: "Error updating the tenant confirmation for lease"
        });
    }

    //Return result
    return res.redirect(`${process.env.FRONT_END_ROOT}`);
});
