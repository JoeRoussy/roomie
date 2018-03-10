import React, { Component } from 'react';
import { Button, Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import HomeSearch from '../../components/Search/HomeSearch';
import ViewListingsSearch from '../../components/Search/ViewListingsSearch';
import { search, handleLocationChange } from '../../../redux/actions/searchActions';

import './styles.css';

@connect((store)=>({
    user: store.userReducer.user,
    searchState: store.searchReducer
}))
class Home extends Component {
    constructor(props){
        super(props)

        this.navigateToCreateListing = this.navigateToCreateListing.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.processLocation = this.processLocation.bind(this);
        this.submitSearch = this.submitSearch.bind(this);

    }

    navigateToCreateListing(user) {
        return user ? this.props.dispatch(push('/login')):this.props.dispatch(push('/create-listing'));
    }

    processLocation(searchArgs) {
        if(searchArgs === '') return null;
        const processedArgs = [`location=${searchArgs.trim()}`]; //TODO PROCESS LOCATION
        return processedArgs;
    }
    submitSearch(event,searchArgs) {
        if(event.keyCode === 13){
            const processedArgs = this.processLocation(searchArgs);
            if(processedArgs === null || processedArgs === '') return;
            this.props.dispatch(search(processedArgs, 1));
            return this.props.dispatch(push('/listings'));
        }
    }

    handleLocationChange(val){
        this.props.dispatch(handleLocationChange(val))
    }

    render(){
         const locationProps = {
            value: this.props.searchState.location,
            onChange: (event) => this.handleLocationChange(event),
            onKeyUp: (event) => this.submitSearch(event, this.props.searchState.location)
        }

        return (
            <div>
                <div className='section'>
                    <Container>
                        <HomeSearch
                            navigateToCreateListing={() => this.navigateToCreateListing(this.props.user)}
                            inputProps = {locationProps}
                        />
                    </Container>
                    {/* INSERT 5 POPULAR LISTINGS HERE */}
                </div>
                <div id='homeRoommatesSection' className='section primaryColourSection'>
                    <Container>
                        {/* TODO: Need to change functionality based on if they have groups or not */}
                        <h2>Looking for Roommates?</h2>
                        <p id="surveyDescription">Take a survey about your living preferences and we will find roommates for you to choose from that are looking in the same city as you!</p>
                        <Button type='button' className='primaryColourAlt'>Get Started</Button>
                    </Container>
                </div>
            </div>
        )
    }
}

export default Home;
