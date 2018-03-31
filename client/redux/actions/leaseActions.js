import axios from 'axios';
import { userTypes } from '../../../common/constants';
import { toast } from 'react-toastify';


export const populateForm = (listing) => ({
    type: 'POPULATE_FORM',
    payload: listing
});


export const submitForm = (values, listing, tenants) => {
    const mappedTenants = tenants.map(x=>(x.api_response._id));
    const listingId = listing._id;

    const submissionData = {
        ...values,
        listing: listingId,
        tenantIds: [...mappedTenants]
    }

    const action = {
        type: 'SUBMIT_LEASE_FORM',
        payload: axios.post(`${process.env.API_ROOT}/api/myListings/leases`, submissionData)
            .then((res) => {
                toast.success('Lease created successfully!');
                return res;
            })
    }

    return action;
}

export const searchForTenants = (values) => ({
    type: 'LEASE_TENANT_SEARCH',
    payload: axios.get(`${process.env.API_ROOT}/api/users?name=${values}&type=${userTypes.tenant}`)
        .catch((e)=>{
            toast.error('Something went wrong with the tenant search, please try again later');
            return e
        })
});

export const setSearchValue = (value) => ({
    type: 'LEASE_TENANT_SEARCH_SET_VALUE',
    payload: value
});

export const addTenant = (tenant) => ({
    type: 'LEASE_ADD_TENANT',
    payload: tenant
});

export const removeTenant = (user) => ({
    type: 'LEASE_REMOVE_TENANT',
    payload: user
});