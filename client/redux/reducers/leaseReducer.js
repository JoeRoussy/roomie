const config = {
    listing: null,
    tenants: [],
    searchLoading: false,
    searchResults: [],
    searchValue: '',
    errorMessage: null
};

const mapTenantsForSearchResults = (tenant) => ({
    title: tenant.name,
    image: `${process.env.ASSETS_ROOT}${tenant.profilePictureLink}`,
    islandlord: tenant.islandlord ? 'true': 'false',
    api_response: tenant
});

const leaseReducer = (state = config, actions) => {
    const { 
        type,
        payload
    } = actions;
    
    switch(type){
        case 'POPULATE_FORM' : {
            state = {
                ...state,
                listing: payload
            }
            break;
        }

        case 'LEASE_ADD_TENANT': {
            let tenant = payload;
            state = {
                ...state,
                tenants: state.tenants.concat(tenant)
            }
            break;
        }

        case 'LEASE_REMOVE_TENANT': {
            const {
                _id
            } = payload.api_response;
            const newTenants = state.tenants.filter(x=> x.api_response._id !== _id);

            state = {
                ...state,
                tenants: [...newTenants]
            }

            break;
        }

        case 'LEASE_TENANT_SEARCH_FULFILLED': {
            const {
                data: {
                    users
                } = {}
            } = payload;
            state = {
                ...state,
                searchLoading: false,
                searchResults: users.map(mapTenantsForSearchResults)
            }
            break;
        }

        case 'LEASE_TENANT_SEARCH_PENDING': {
            state = {
                ...state,
                searchLoading: true,
                searchResults: []
            }
            break;
        }

        case 'LEASE_TENANT_SEARCH_REJECT': {
            state = {
                ...state,
                searchLoading: false,
                searchResults: []
            }
        }

        case 'LEASE_TENANT_SEARCH_SET_VALUE': {
            state = {
                ...state,
                searchValue: payload
            };

            break;
        }
    }

    return state;
}

export default leaseReducer;