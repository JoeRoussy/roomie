import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { change } from 'redux-form';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { Button, Loader, Dimmer } from 'semantic-ui-react';
import TimeblockForm from '../../components/TimeblockForm';
import { createTimeblock, getSchedules } from '../../../redux/actions/scheduleActions';

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

    render(){
        const redirectSection = this.props.userInfo.user ? '' : <Redirect to='/sign-in'/>;
        const availabilityOptions = [{text:'Unavailable' , value:'Unavailable'}];
        const repeatingOptions = [{text:'None' , value:'None'}, {text:'Daily' , value:'Daily' }, {text:'Weekly' , value:'Weekly' }];

        const timeblock = this.state.isEditingTimeblock ?
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
                    start: moment(),
                    end: moment().add(1,'hour'),
                    availability: availabilityOptions[0].value,
                    repeating: repeatingOptions[0].value
                }}
            />
                :
            <Button onClick={this.toggleForm} content='Set Availability'/>

        const events = !this.props.scheduleInfo.loading ? this.props.scheduleInfo.events : [];

        let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);

        const schedule = this.props.scheduleInfo.loading ?
            <Dimmer active>
                <Loader>Loading</Loader>
            </Dimmer>
                :
            <div id='scheudleCalendarView'>
                <BigCalendar
                    events={events}
                    views={['month', 'agenda']}
                    step={60}
                    showMultiDayTimes
                    defaultDate={new Date()}
                    selectable
                />
            </div>

        return (

            <div id='scheduleWrapper'>
                {redirectSection}
                {/* Timeblock */}
                {timeblock}

                {/* Schedule */}
                {schedule}
            </div>
        )
    }
}

export default Schedule;
