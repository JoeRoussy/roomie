import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { Container } from 'semantic-ui-react';
import { change } from 'redux-form';
import './styles.css';



const ScheduleMeeting = ({
    user,
    participants,
    aggregatedEvents,
    loading,
    step
})=>{
    let content;
    if(step == 1){
        content = <div>
            this is the participants search thing
        </div>
    }
    else if(step == 2){
        content = <div>
            this is the calendar view + meeting panel
        </div>
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
        loading,
        step,
    } = {}
}) => ({
    user,
    participants,
    aggregatedEvents,
    loading,
    step
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleMeeting);