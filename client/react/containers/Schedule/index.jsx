import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { push } from 'react-router-redux';
import { change } from 'redux-form';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { Container, Button, Loader, Dimmer, Transition } from 'semantic-ui-react';
import TimeblockForm from '../../components/TimeblockForm';
import {
    createTimeblock,
    getSchedules,
    showEventDetail,
    clearEventDetail,
    deleteMeeting,
    deleteTimeblock
} from '../../../redux/actions/scheduleActions';

import EventDetailView from '../../components/EventDetailView';

import './styles.css';


@connect((store)=>({
    formInfo: store.form.timeblockForm,
    userInfo: store.userReducer,
    scheduleInfo: store.scheduleReducer
}))
class Schedule extends Component{
    constructor(props){
        super(props);
        this.state = {
            isEditingTimeblock: false,
            selectedDate: moment(),
            selectedStartTime: moment(),
            selectedEndTime: moment().add(1,'hour')
        }
        BigCalendar.momentLocalizer(moment);
        this.dateChange = this.dateChange.bind(this);
        this.startTimeChange = this.startTimeChange.bind(this);
        this.endTimeChange = this.endTimeChange.bind(this);
        this.toggleForm = this.toggleForm.bind(this);
        this.submitTimeblock = this.submitTimeblock.bind(this);
        this.naviageToScheduleMeeting = this.naviageToScheduleMeeting.bind(this);
        this.showDetailView = this.showDetailView.bind(this);
        this.hideDetailView = this.hideDetailView.bind(this);
        this.onEventDelete = this.onEventDelete.bind(this);
    }

    componentDidMount(){
        const user = this.props.userInfo;
        if(user) this.props.dispatch(getSchedules());
    }

    dateChange(date){
        this.props.dispatch(change('timeblockForm', 'date', date));
        this.setState({selectedDate:date});
    }

    startTimeChange(time){
        this.props.dispatch(change('timeblockForm', 'start', time));
        this.setState({selectedStartTime:time})
    }

    endTimeChange(time){
        this.props.dispatch(change('timeblockForm', 'end', time));
        this.setState({selectedEndTime:time})
    }

    toggleForm(){
        this.setState({isEditingTimeblock:!this.state.isEditingTimeblock});
    }

    submitTimeblock(){
        this.toggleForm();

        const {
            values
        } = this.props.formInfo;

        const user= this.props.userInfo;
        this.props.dispatch(createTimeblock(values, user));
    }

    naviageToScheduleMeeting() {
        this.props.dispatch(push('/schedule-meeting'));
    }

    showDetailView(event) {
        this.props.dispatch(showEventDetail(event));
    }

    hideDetailView() {
        this.props.dispatch(clearEventDetail())
    }

    onEventDelete(event) {
        if (event.type === 'Meeting') {
            return () => this.props.dispatch(deleteMeeting(event._id));
        } else {
            return () => this.props.dispatch(deleteTimeblock(event._id));
        }
    }

    render(){
        const redirectSection = this.props.userInfo.user ? '' : <Redirect to='/sign-in'/>;
        const availabilityOptions = [{text:'Unavailable' , value:'Unavailable'}];
        const repeatingOptions = [{text:'None' , value:'None'}, {text:'Daily' , value:'Daily' }, {text:'Weekly' , value:'Weekly' }];

        const timeblock = this.state.isEditingTimeblock ? (
            <TimeblockForm
                submitTimeblock={this.submitTimeblock}
                dateChange={this.dateChange}
                selectedDate={this.state.selectedDate}
                startTimeChange={this.startTimeChange}
                endTimeChange={this.endTimeChange}
                startTime={this.state.selectedStartTime}
                endTime={this.state.selectedEndTime}
                availabilityOptions={availabilityOptions}
                repeatingOptions={repeatingOptions}
                cancel={this.toggleForm}
                initialValues={{
                    date: moment(),
                    start: moment().startOf('hour'),
                    end: moment().startOf('hour').add(1,'hour'),
                    availability: availabilityOptions[0].value,
                    repeating: repeatingOptions[0].value
                }}
            />
        ) : (
            <div id='scheduleButtonWrapper'>
                <Button className='primaryColour' onClick={this.naviageToScheduleMeeting} content='Schedule Meeting'/>
                <Button className='primaryColour' onClick={this.toggleForm} content='Set Availability'/>
            </div>
        );


        const events = !this.props.scheduleInfo.loading ? this.props.scheduleInfo.events : [];

        let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);

        const schedule = this.props.scheduleInfo.loading ?
            <Dimmer active>
                <Loader>Loading</Loader>
            </Dimmer>
                :
            <div id='scheduleCalendarView'>
                <EventDetailView
                    event={this.props.scheduleInfo.eventBeingViewed}
                    onClose={this.hideDetailView}
                    onDelete={this.onEventDelete}
                    isLoading={this.props.scheduleInfo.eventDeleteLoading}
                    errorMessage={this.props.scheduleInfo.eventDeleteErrorMessage}
                />
                <BigCalendar
                    popup
                    events={events}
                    views={['month']}
                    step={60}
                    showMultiDayTimes
                    defaultDate={new Date()}
                    selectable
                    onSelectEvent={this.showDetailView}
                />
            </div>

        return (

            <Container id='scheduleWrapper' className='rootContainer'>
                {redirectSection}
                <h1>Your Schedule</h1>
                {/* Timeblock */}
                {timeblock}

                {/* Schedule */}
                {schedule}
            </Container>
        )
    }
}

export default Schedule;
