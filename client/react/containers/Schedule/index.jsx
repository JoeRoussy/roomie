import React, { Component } from 'react';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import { Button } from 'semantic-ui-react';
import TimeblockForm from '../../components/TimeblockForm';
import moment from 'moment';
import { createTimeblock } from '../../../redux/actions/scheduleActions';


@connect((store)=>({
    formInfo: store.form.timeblockForm,
    userInfo: store.userReducer
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

        this.dateChange = this.dateChange.bind(this);
        this.startTimeChange = this.startTimeChange.bind(this);
        this.endTimeChange = this.endTimeChange.bind(this);
        this.toggleForm = this.toggleForm.bind(this);
        this.submitTimeblock = this.submitTimeblock.bind(this);
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
        const availabilityOptions = [{text:'Unavailable' , value:'Unavailable'}, {text:'Available' , value:'Available' }];
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

        return (
            <div>
                {/* Timeblock */}
                {timeblock}

                {/* Schedule */}

            </div>
        )
    }
}

export default Schedule;