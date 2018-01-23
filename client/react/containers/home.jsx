import React from 'react';
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import styles from '../../styles/styles.css';
import BasicSearch from '../components/Search/BasicSearch';
import { search } from '../../redux/actions/searchActions';

const processArgs = (args) => {

}

const createListing = () => {
    console.log("Create Listing");
}

const Home = ({
    submitSearch,
    values: {
        values: {
            searchBar
        } = { }
    } = {}
}) => {
    return(
        <div>
            {JSON.stringify(searchBar, null, 4)}
            <BasicSearch 
                submitSearch={() => submitSearch(searchBar)}
                createListing={createListing}
            />
        </div>
    )
}

const mapDispatchToProps = (dispatch) => ({
    submitSearch: (args) => {
        console.log("####", args)
        const processedArgs = processArgs(args);

        return dispatch(search(processedArgs));
    } 
})

const mapStateToProps = ({
    form
}) => ({
    values: form.basicSearch
});


export default connect(mapStateToProps, mapDispatchToProps)(Home);
