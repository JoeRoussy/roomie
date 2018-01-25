import React from 'react';
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import styles from '../../styles/styles.css';
import HomeSearch from '../components/Search/HomeSearch';
import ViewListingsSearch from '../components/Search/ViewListingsSearch';
import { search, getPopularListings } from '../../redux/actions/searchActions';

const Home = ({
    submitSearch,
    createListing,
    searchArgs,
    user,
    loadPopularListings,
    searchState
}) => {
    let items = ''

    if(searchState.fulfilled && searchState.listings < 1) items = "No results found";
    else if(!searchState.fulfilled) items = "Waiting";
    else items = JSON.stringify(searchState.listings);

    return(
        <div>
            <HomeSearch 
                submitSearch={() => submitSearch(searchArgs)}
                createListing={() => createListing(user)}
            />
            {/* INSERT 5 POPULAR LISTINGS HERE */}
        </div>
    )
}



const processLocation = (searchArgs) => {
    if(searchArgs.values === undefined || searchArgs.values.searchBar === undefined) return null;
    const args = searchArgs.values.searchBar;
    const processedArgs = `location=${args.trim()}`;
    return processedArgs;
}

const mapDispatchToProps = (dispatch) => ({
    //Takes search arguments from the searchbar and directs user to ViewListings Container with results
    submitSearch: (searchArgs) => {
        const processedArgs = processLocation(searchArgs);
        if(processedArgs === null || processedArgs === '') return;
        dispatch(search(processedArgs));
        return dispatch(push('/browse-listings'));
    },
    // Directs the user to the create listings page -> if user is not signed in, prompt to either log in or create account
    createListing: (user) => {
        return user===undefined ? dispatch(push('/login')):dispatch(push('/create-listing'));
    },
    loadPopularListings: () => dispatch(getPopularListings())
})

const mapStateToProps = ({
    form,
    userReducer,
    searchReducer
}) => ({
    searchArgs: form.homeSearch,
    user: userReducer.user,
    searchState: searchReducer
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);