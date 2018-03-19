import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { Container, Search, Card, Button, Divider } from 'semantic-ui-react';

import ProfileCard from '../../components/ProfileCard';
import ListingDisplay from '../../components/ListingDisplay';

import {
    nextStep,
    previousStep,
    userSearch,
    addParticipant,
    removeParticipant,
    clearLandlord,
    landlordSearch,
    addLandlord,
    listingSearch,
    setListing,
    clearListing
} from '../../../redux/actions/scheduleMeetingActions';

import './styles.css';


const ScheduleMeeting = ({
    onNextStep,
    onPreviousStep,
    user,
    listing,
    participants,
    invitedLandlord,
    aggregatedEvents,
    isUserSearchLoading,
    step,
    isLoading,
    userSearchResults,
    onUserSearchResultSelected,
    onUserSearchChange,
    onLandlordClear,
    landlordSearchResults,
    landlordSearchValue,
    isLandlordSearchLoading,
    onLandlordSeachResultSelected,
    onLandlordSearchChange,
    listingSearchResults,
    isListingSearchLoading,
    onListingSeachResultSelected,
    onListingSearchChange,
    onClearListing,
    onUserRemove
}) => {
    const userRedirect = user ? '' : (<Redirect to='sign-in' />);

    // Format roommates as the api responses for continutity with other card displays
    const roommateParticipants = participants
            .filter(x => x.islandlord === 'false') // Recall islandlord needs to be a string
            .map(x => ({
                ...x.api_response
            }))
            .map(roommate => (
                <ProfileCard
                    bottomExtras={(
                        <Card.Content>
                            <Button color='red' onClick={onUserRemove(roommate)} basic>Remove</Button>
                        </Card.Content>
                    )}
                    user={roommate}
                    key={roommate._id}
                />
            ));

    let content;

    if (step === 1) {
        // NOTE: Skirt issues about changin state after mount by using classes
        const landlordUserSection = (
            <div id='landlordSectionWrapper'>
                <div id='landlordSearchWrapper' className={invitedLandlord ? 'hidden' : ''}>
                    <h2>Invite A Landlord</h2>
                    <Search
                        results={landlordSearchResults}
                        loading={isLandlordSearchLoading}
                        onResultSelect={onLandlordSeachResultSelected}
                        onSearchChange={onLandlordSearchChange}
                    />
                </div>
                <div id='landlordDisplayWrapper' className={`centered${invitedLandlord ? '' : ' hidden'}`}>
                    <h2>Landlord</h2>
                    <ProfileCard className='centered'
                        user={invitedLandlord ? invitedLandlord.api_response : undefined}
                        bottomExtras={(
                            <Card.Content className='centered'>
                                <Button className='primaryColour' onClick={onLandlordClear}>Invite A Different Landlord</Button>
                            </Card.Content>
                        )}
                    />
                </div>
            </div>
        );

        const listingSection = (
            <div id='listingSectionWrapper' className={invitedLandlord ? '' : 'hidden'}>
                <Divider />
                <div id='chooseListingWrapper' className={listing ? 'hidden' : ''}>
                    <h2>Choose a Listing</h2>
                    <Search
                        results={listingSearchResults}
                        loading={isListingSearchLoading}
                        onResultSelect={onListingSeachResultSelected}
                        onSearchChange={invitedLandlord ? onListingSearchChange(invitedLandlord.api_response._id) : null}
                    />
                </div>
                <div id='viewListingWrapper' className={listing ? '' : 'hidden'}>
                    <ListingDisplay
                        listing={listing ? listing.api_response : {}}
                        singleImage={listing ? listing.image : null}
                    />
                    <Button id='scheduleMeetingChooseDifferentListingButton' className='primaryColour' onClick={onClearListing}>Choose A Different Listing</Button>
                </div>
                <Divider />
            </div>
        );

        const userSection = (
            <div id='userSearchWrapper'>
                <h2>Invite Your Roommates</h2>
                <Search
                    results={userSearchResults}
                    loading={isUserSearchLoading}
                    onResultSelect={onUserSearchResultSelected}
                    onSearchChange={onUserSearchChange}
                />
                <Card.Group className='centered'>
                    {roommateParticipants}
                </Card.Group>
            </div>
        );

        content = (
            <div id='stepOneWrapper'>
                {landlordUserSection}
                {listingSection}
                {userSection}
                <Button id='scheduleMeetingStepOneAdvanceButton' color='green' onClick={onNextStep} disabled={!listing || !invitedLandlord}>Choose A Time</Button>
            </div>
        );
    } else if (step === 2) {
        content = (
            <div>
                this is the calendar view + meeting panel
            </div>
        );
    } else if (step === 3) {

    }

    return (
        <Container>
            {userRedirect}
            <h1>Book a Meeting</h1>
            {content}
        </Container>
    )
}

const mapStateToProps = ({
    userReducer: {
        user
    } = {},
    scheduleMeetingReducer: {
        listing,
        participants,
        invitedLandlord,
        aggregatedEvents,
        isLoading,
        isUserSearchLoading,
        step,
        userSearchResults,
        landlordSearchResults,
        landlordSearchValue,
        isLandlordSearchLoading,
        listingSearchResults,
        isListingSearchLoading
    } = {}
}) => ({
    user,
    listing,
    participants,
    invitedLandlord,
    userSearchResults,
    aggregatedEvents,
    isUserSearchLoading,
    isLoading,
    step,
    landlordSearchResults,
    landlordSearchValue,
    isLandlordSearchLoading,
    listingSearchResults,
    isListingSearchLoading
});

const mapDispatchToProps = (dispatch) => ({
    onNextStep: () => dispatch(nextStep()),
    onPreviousStep: () => dispatch(previousStep()),
    onUserSearchChange: (e, data) => {
        const {
            value
        } = data;

        if (value.length >= 3) {
            dispatch(userSearch(value));
        }

    },
    onUserSearchResultSelected: (e, data) => {
        const {
            result: selectedUser
        } = data;

        dispatch(addParticipant(selectedUser));
    },
    onLandlordClear: () => {
        dispatch(clearListing());
        dispatch(clearLandlord());
    },
    onLandlordSearchChange: (e, data) => {
        const {
            value
        } = data;

        if (value.length >= 3) {
            dispatch(landlordSearch(value))
        }
    },
    onLandlordSeachResultSelected: (e, data) => {
        const {
            result: selectedUser
        } = data;

        dispatch(addLandlord(selectedUser));
    },
    onListingSearchChange: (id) => (e, data) => {
        const {
            value
        } = data;

        if (value.length >= 3) {
            dispatch(listingSearch(id, value));
        }
    },
    onListingSeachResultSelected: (e, data) => {
        const {
            result: selectedListing
        } = data;

        dispatch(setListing(selectedListing));
    },
    onClearListing: () => dispatch(clearListing()),
    onUserRemove: (user) => () => dispatch(removeParticipant(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleMeeting);
