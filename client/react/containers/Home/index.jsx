import React, { Component } from 'react';
import { Button, Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import HomeSearch from '../../components/Search/HomeSearch';
import ViewListingsSearch from '../../components/Search/ViewListingsSearch';
import { search, handleLocationChange } from '../../../redux/actions/searchActions';
import { getRoommateSuggestionsForUser } from '../../../redux/actions/homeActions';
import { navigateTo } from '../../../components';

import './styles.css';

@connect((store)=>({
    user: store.userReducer.user,
    searchState: store.searchReducer,
    roommateSuggestions: store.homeReducer.roommateSuggestions
}))
class Home extends Component {
    constructor(props){
        super(props)

        this.navigateToCreateListing = this.navigateToCreateListing.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.processLocation = this.processLocation.bind(this);
        this.submitSearch = this.submitSearch.bind(this);
        this.navigateToRoommateSurvey = this.navigateToRoommateSurvey.bind(this);
    }

    componentWillMount() {
        const {
            user
        } = this.props;

        if (user) {
            this.props.dispatch(getRoommateSuggestionsForUser(user));
        }
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

    navigateToRoommateSurvey() {
        navigateTo(this.props.dispatch)('/roommate-survey');
    }

    render(){
         const locationProps = {
            value: this.props.searchState.location,
            onChange: (event) => this.handleLocationChange(event),
            onKeyUp: (event) => this.submitSearch(event, this.props.searchState.location)
        }

        let roommateSection;

        // TODO: Add loading state for section during call to get roommates

        if (this.props.roommateSuggestions.length) {
            // TODO: View of the roommate cards
            roommateSection = (
                <Container>

                </Container>
            )
        } else {
            roommateSection = (
                <Container>
                    <h2>Looking for Roommates?</h2>
                    <p id="surveyDescription">Take a survey about your living preferences and we will find roommates for you to choose from that are looking in the same city as you!</p>
                    <Button type='button' className='primaryColourAlt' onClick={this.navigateToRoommateSurvey}>Get Started</Button>
                </Container>
            );
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
                    {roommateSection}
                </div>
            </div>
        )
    }
}

export default Home;
