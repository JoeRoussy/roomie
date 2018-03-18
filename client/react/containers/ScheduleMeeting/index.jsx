import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { Container } from 'semantic-ui-react';
import { change } from 'redux-form';

import UserSearch from '../../components/UserSearch';
import { userSearch } from '../../../redux/actions/scheduleMeetingActions';

import './styles.css';



const ScheduleMeeting = ({
    user,
    participants,
    aggregatedEvents,
    isUserSearchLoading,
    step,
    isLoading,
    searchResults,
    onUserSeachResultSelected,
    onUserSearchChange
}) => {
    let content;
    if(step === 1){
        content = (
            <div>
                <UserSearch
                    results={searchResults}
                    isLoading={isUserSearchLoading}
                    onResultSelect={onUserSeachResultSelected}
                    onSearchChange={onUserSearchChange}
                />
            </div>
        );
    }
    else if(step === 2){
        content = (
            <div>
                this is the calendar view + meeting panel
            </div>
        );
    }

    return (
        <div>
            {content}
        </div>
    )
}

const mapStateToProps = ({
    userReducer:{
        user
    } = {},
    scheduleMeetingReducer: {
        participants,
        aggregatedEvents,
        isLoading,
        isUserSearchLoading,
        step,
        searchResults
    } = {}
}) => ({
    user,
    participants,
    searchResults,
    aggregatedEvents,
    isUserSearchLoading,
    isLoading,
    step
});

const mapDispatchToProps = (dispatch) => ({
    onUserSearchChange: (e, data) => {
        const {
            value
        } = data;

        if (value.length >= 3) {
            dispatch(userSearch(value))
        }

    },
    onUserSeachResultSelected: (e, data) => {
        console.log('onUserSeachResultSelected');
        console.log(data);
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleMeeting);
