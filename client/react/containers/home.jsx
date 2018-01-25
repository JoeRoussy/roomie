import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import styles from '../../styles/styles.css';
import PlacesAutoComplete from 'react-places-autocomplete';
import HomeSearch from '../components/Search/HomeSearch';
import ViewListingsSearch from '../components/Search/ViewListingsSearch';
import { search, handleLocationChange } from '../../redux/actions/searchActions';

@connect((store)=>({
    searchArgs: store.form.homeSearch,
    user: store.userReducer.user,
    searchState: store.searchReducer
}))
class Home extends Component {
    constructor(props){
        super(props)

        this.state = {
            location: '',
        }

        this.createListing = this.createListing.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.processLocation = this.processLocation.bind(this);
        this.renderLocationBar = this.renderLocationBar.bind(this);
        this.submitSearch = this.submitSearch.bind(this);
        
    }

    createListing(user) {
        return user===undefined ? this.props.dispatch(push('/login')):this.props.dispatch(push('/create-listing'));
    }

    processLocation(searchArgs) {
        if(searchArgs === '') return null;
        const processedArgs = `location=${searchArgs.trim()}`; //TODO PROCESS LOCATION
        return processedArgs;
    }
    submitSearch(event,searchArgs) {
        if(event.keyCode === 13){
            const processedArgs = this.processLocation(searchArgs);
            if(processedArgs === null || processedArgs === '') return;
            this.props.dispatch(search(processedArgs));
            //return this.props.dispatch(push('/browse-listings'));  
        }
    }

    handleLocationChange(val){
        this.props.dispatch(handleLocationChange(val))
    }

    renderLocationBar(inputProps) {
        return <PlacesAutoComplete inputProps={inputProps} />
    }

    render(){
         const locationProps = {
            value: this.props.searchState.location,
            onChange: this.handleLocationChange,
            onKeyUp: (event) => this.submitSearch(event, this.props.searchState.location)
        }

        return (
            <div>
                {JSON.stringify(this.props.searchState.listings)}   
                <HomeSearch 
                    createListing={() => this.createListing(this.props.user)}
                    inputProps = {locationProps}
                />
                {/* INSERT 5 POPULAR LISTINGS HERE */}
            </div>
        )
    }

}

export default Home;