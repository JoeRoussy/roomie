import React, { Component } from 'react';
import { Button, Container, Dimmer, Loader, Card, Label, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import moment from 'moment';
import queryString from 'query-string';
import { Redirect } from 'react-router';

import HomeSearch from '../../components/Search/HomeSearch';
import ViewListingsSearch from '../../components/Search/ViewListingsSearch';
import { search, handleLocationChange } from '../../../redux/actions/searchActions';
import { getRoommateSuggestionsForUser } from '../../../redux/actions/homeActions';
import { navigateTo } from '../../../components';
import { setPasswordResetToken } from '../../../redux/actions/forgotPasswordFormActions';

import './styles.css';

@connect((store)=>({
    user: store.userReducer.user,
    searchState: store.searchReducer,
    recommendedRoommates: store.homeReducer.recommendedRoommates,
    isRoommatesLoading: store.homeReducer.isLoadingRoommateSuggestions
}))

class Home extends Component {
    constructor(props){
        super(props)

        this.navigateToCreateListing = this.navigateToCreateListing.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.processLocation = this.processLocation.bind(this);
        this.submitSearch = this.submitSearch.bind(this);
        this.navigateToRoommateSurvey = this.navigateToRoommateSurvey.bind(this);
        this.onPasswordResetToken = this.onPasswordResetToken.bind(this);
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

    onPasswordResetToken(token) {
        this.props.dispatch(setPasswordResetToken(token));
    }

    render(){
         const locationProps = {
            value: this.props.searchState.location,
            onChange: (event) => this.handleLocationChange(event),
            onKeyUp: (event) => this.submitSearch(event, this.props.searchState.location)
        };

        // TODO: There has to be a better way with server side rendering
        const queryParams = queryString.parse(this.props.location.search);
        let passwordResetRedirect = '';

        if (queryParams.passwordResetToken) {
            passwordResetRedirect = (<Redirect to='/forgot-password-form'/>);
            this.onPasswordResetToken(queryParams.passwordResetToken);
        }

        let roommateSection;

        if (this.props.recommendedRoommates.length) {
            const roommateCards = this.props.recommendedRoommates.map((roommate) => (
                <Card key={roommate._id} raised>
                    <Label color='green' floating>{Math.floor(roommate.percentMatch)}%</Label>
                    <Card.Content>
                        <Image size='tiny' floated='right' src={`${process.env.ASSETS_ROOT}${roommate.profilePictureLink}`} />
                        <Card.Header>
                            {roommate.name}
                        </Card.Header>
                        <Card.Meta>
                            <span>Joined:</span>
                        </Card.Meta>
                        <Card.Meta>
                            <span>{moment(roommate.createdAt).format('MMMM Do YYYY')}</span>
                        </Card.Meta>
                    </Card.Content>
                    <Card.Content className='centered'>
                        <Button color='green'>Message</Button>
                    </Card.Content>
                </Card>
            ));

            roommateSection = (
                <Container>
                    <h2>Roommates Recommened For You</h2>
                    <Card.Group id='roommateCards' className='centered'>
                        {roommateCards}
                    </Card.Group>
                    <div id='retakeSurvey'>
                        <h3>Not Finding A Good Fit?</h3>
                        <Button className='primaryColourAlt' onClick={this.navigateToRoommateSurvey}>Take Survey Again</Button>
                    </div>
                </Container>
            )
        } else {
            const innerSection = this.props.isRoommatesLoading ? (
                <div id='loaderContainer'>
                    <div id='loaderInnerWrapper'>
                        <Loader active>Loading</Loader>
                    </div>
                </div>
            ) : (
                <div>
                    <h2>Looking for a Roomie?</h2>
                    <p id="surveyDescription">Complete the short survey to find the right match for you!</p>
                    <Button type='button' className='primaryColourAlt' onClick={this.navigateToRoommateSurvey}>Get Started</Button>
                </div>
            );

            roommateSection = (
                <Container>
                    {innerSection}
                </Container>
            );
        }

        return (
            <div>
                {passwordResetRedirect}
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
