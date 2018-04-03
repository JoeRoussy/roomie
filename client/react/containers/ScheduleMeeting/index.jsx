import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { Container, Search, Card, Button, Divider, Dimmer, Loader } from 'semantic-ui-react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { change } from 'redux-form';

import ProfileCard from '../../components/ProfileCard';
import ListingDisplay from '../../components/ListingDisplay';
import ScheduleMeetingForm from '../../components/ScheduleMeetingForm';
import EventDetailView from '../../components/EventDetailView';

import { showEventDetail, clearEventDetail, deleteMeeting, deleteTimeblock } from '../../../redux/actions/scheduleActions';
import {
    nextStep,
    previousStep,
    userSearch,
    setUserSearchValue,
    addParticipant,
    removeParticipant,
    clearLandlord,
    landlordSearch,
    addLandlord,
    listingSearch,
    setListing,
    clearListing,
    getAggregateSchedules,
    submitMeetingForm,
    setLandlordSearchValue,
    setListingSearchValue
} from '../../../redux/actions/scheduleMeetingActions';

import './styles.css';


const ScheduleMeeting = ({
    onNavigateToStepTwo,
    onNextStep,
    onPreviousStep,
    user,
    listing,
    participants,
    invitedLandlord,
    aggregatedEvents,
    isUserSearchLoading,
    isCalendarViewLoading,
    events,
    step,
    isMeetingFormLoading,
    userSearchResults,
    onUserSearchResultSelected,
    onUserSearchChange,
    userSearchValue,
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
    listingSearchValue,
    onClearListing,
    onUserRemove,
    onMeetingSubmit,
    formValues,
    meetingFormErrorMessage,
    onDateChange,
    onStartTimeChange,
    onEndTimeChange,
    selectedDate,
    startTime,
    endTime,
    onShowEventDetail,
    eventBeingViewed,
    onHideDetailView
}) => {
    const userRedirect = user ? '' : (<Redirect to='sign-in' />);

    BigCalendar.momentLocalizer(moment);

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
                        placeholder='Seach By Name'
                        results={landlordSearchResults}
                        loading={isLandlordSearchLoading}
                        onResultSelect={onLandlordSeachResultSelected}
                        onSearchChange={onLandlordSearchChange}
                        value={landlordSearchValue}
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
                        placeholder='Seach By Location'
                        results={listingSearchResults}
                        loading={isListingSearchLoading}
                        onResultSelect={onListingSeachResultSelected}
                        onSearchChange={invitedLandlord ? onListingSearchChange(invitedLandlord.api_response._id) : null}
                        value={listingSearchValue}
                    />
                </div>
                <div id='viewListingWrapper' className={listing ? '' : 'hidden'}>
                    <ListingDisplay
                        listing={listing ? listing.api_response : {}}
                        carouselWidth='450px'
                        centered
                    />
                <div className='centered'>
                        <Button id='scheduleMeetingChooseDifferentListingButton' className='primaryColour' onClick={onClearListing}>Choose A Different Listing</Button>
                    </div>
                </div>
                <Divider />
            </div>
        );

        const userSection = (
            <div id='userSearchWrapper'>
                <h2>Invite Your Roommates</h2>
                <Search
                    placeholder='Seach By Name'
                    results={userSearchResults}
                    loading={isUserSearchLoading}
                    onResultSelect={onUserSearchResultSelected}
                    onSearchChange={onUserSearchChange}
                    value={userSearchValue}
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
                <Button id='scheduleMeetingStepOneAdvanceButton' color='green' onClick={onNavigateToStepTwo(participants)} disabled={!listing || !invitedLandlord}>Choose A Time</Button>
            </div>
        );
    } else if (step === 2) {
        const calendarSection = isCalendarViewLoading ? (
            <Dimmer active>
                <Loader>Loading</Loader>
            </Dimmer>
        ) : (
            <div id='scheduleCalendarView'>
                <EventDetailView
                    event={eventBeingViewed}
                    onClose={onHideDetailView}
                />
                <BigCalendar
                    popup
                    events={events}
                    views={['month']}
                    step={60}
                    showMultiDayTimes
                    defaultDate={new Date()}
                    selectable
                    onSelectEvent={onShowEventDetail}
                />
            </div>
        );

        content = (
            <div id='stepTwoWrapper'>
                <Button id='scheduleMeetingBackToStepOneButton' onClick={onPreviousStep} className='primaryColour'>Back</Button>
                {calendarSection}
                <h2>Set Up Meeting</h2>
                <ScheduleMeetingForm
                    onSubmit={onMeetingSubmit(participants, listing)}
                    formValues={formValues}
                    errorMessage={meetingFormErrorMessage}
                    dateChange={onDateChange}
                    selectedDate={selectedDate}
                    startTime={startTime}
                    endTime={endTime}
                    startTimeChange={onStartTimeChange}
                    endTimeChange={onEndTimeChange}
                    isLoading={isMeetingFormLoading}
                    initialValues={{
                        date: moment(),
                        start: moment().startOf('hour'),
                        end: moment().startOf('hour').add(1,'hour'),
                    }}
                />
            </div>
        );
    }

    return (
        <Container id='scheduleMeetingContainer' className='rootContainer'>
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
        isMeetingFormLoading,
        isCalendarViewLoading,
        events,
        isUserSearchLoading,
        step,
        userSearchResults,
        userSearchValue,
        landlordSearchResults,
        landlordSearchValue,
        isLandlordSearchLoading,
        listingSearchResults,
        isListingSearchLoading,
        listingSearchValue,
        meetingFormErrorMessage
    } = {},
    scheduleReducer: {
        eventBeingViewed
    } = {},
    form: {
        scheduleMeetingForm: {
            values: formValues
        } = {}
    } = {}
}) => ({
    user,
    listing,
    participants,
    invitedLandlord,
    userSearchResults,
    userSearchValue,
    aggregatedEvents,
    isUserSearchLoading,
    isMeetingFormLoading,
    isCalendarViewLoading,
    events,
    step,
    landlordSearchResults,
    landlordSearchValue,
    isLandlordSearchLoading,
    listingSearchResults,
    isListingSearchLoading,
    listingSearchValue,
    formValues,
    meetingFormErrorMessage,
    selectedDate: formValues ? formValues.date : moment(),
    startTime: formValues ? formValues.start : moment().startOf('hour'),
    endTime: formValues ? formValues.end : moment().startOf('hour').add(1,'hour'),
    eventBeingViewed
});

const mapDispatchToProps = (dispatch) => ({
    onNavigateToStepTwo: (participants) => () => {
        dispatch(getAggregateSchedules(participants));
        dispatch(nextStep());
    },
    onNextStep: () => dispatch(nextStep()),
    onPreviousStep: () => dispatch(previousStep()),
    onUserSearchChange: (e, data) => {
        const {
            value
        } = data;

        dispatch(setUserSearchValue(value));

        if (value.length >= 3) {
            dispatch(userSearch(value));
        }

    },
    onUserSearchResultSelected: (e, data) => {
        const {
            result: selectedUser
        } = data;

        dispatch(setUserSearchValue(''));
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

        dispatch(setLandlordSearchValue(value));

        if (value.length >= 3) {
            dispatch(landlordSearch(value))
        }
    },
    onLandlordSeachResultSelected: (e, data) => {
        const {
            result: selectedUser
        } = data;

        dispatch(setLandlordSearchValue(''));
        dispatch(addLandlord(selectedUser));
    },
    onListingSearchChange: (id) => (e, data) => {
        const {
            value
        } = data;

        dispatch(setListingSearchValue(value));

        if (value.length >= 3) {
            dispatch(listingSearch(id, value));
        }
    },
    onListingSeachResultSelected: (e, data) => {
        const {
            result: selectedListing
        } = data;

        dispatch(setListingSearchValue(''));
        dispatch(setListing(selectedListing));
    },
    onClearListing: () => dispatch(clearListing()),
    onUserRemove: (user) => () => dispatch(removeParticipant(user)),
    onMeetingSubmit: (participants, listing) => (formData) => () => {
        dispatch(submitMeetingForm({
            participants,
            listing,
            ...formData
        }));
    },
    onDateChange: (date) => dispatch(change('scheduleMeetingForm', 'date', date)),
    onStartTimeChange: (time) => dispatch(change('scheduleMeetingForm', 'start', time)),
    onEndTimeChange: (time) => dispatch(change('scheduleMeetingForm', 'end', time)),
    onShowEventDetail: (event) => dispatch(showEventDetail(event)),
    onHideDetailView: () => dispatch(clearEventDetail())
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleMeeting);
