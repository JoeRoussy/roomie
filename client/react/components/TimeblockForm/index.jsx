import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import moment from 'moment';
import { Input, Dropdown } from 'react-semantic-redux-form';
import { Button, Divider, Form, Label } from 'semantic-ui-react';
import WrappedDatePicker from '../WrappedDatePicker';
import WrappedTimePicker from '../WrappedTimePicker';

/* Validation */
const validate = (formValues) => {
    let errors = {};
    const {
        date,
        start,
        end,
        availability,
        repeating
    } = formValues;
    const now = moment();

    if(!date){
        errors = {
            date: 'Please select a date',
            ...errors
        };
    }
    else if(now.diff(date, 'days') <0){
        errors = {
            date: 'Please select a date that is today or later',
            ...errors
        }
    }

    if(!start){
        errors = {
            start: 'Please select a start time',
            ...errors
        };
    }
    if(!end){
        errors = {
            end: 'Please select a end time',
            ...errors
        };
    }

    if(!start && !end && start.diff(end, 'minutes') < 0){
        errors = {
            start: 'Please select a start time that is earlier than end time',
            end: 'Please select a end time that is later than start time',
            ...errors
        }
    }

    if(availability){
        errors = {
            availability: 'Please select an availability option',
            ...errors
        };
    }

    if(!repeating){
        errors = {
            repeating: 'Please select a repeating option',
            ...errors
        };
    }

    return errors;
}

/* Supplemental Stuff */

/* Main class */
const TimeblockForm = ({
    submitTimeblock,
    errorMessage,
    dateChange,
    selectedDate,
    startTime,
    endTime,
    startTimeChange,
    endTimeChange,
    availabilityOptions,
    repeatingOptions,
    cancel
}) => {
    return (
        <div>
            <Form onSubmit={submitTimeblock} error={!!errorMessage}>
                {/* type of availability */}
                <Divider />
                <div>
                    <Label size='large'>Availability type:</Label>
                    <br/>
                    <Field
                        name='availability'
                        component={Dropdown}
                        placeholder='Select availability type'
                        selection
                        options={availabilityOptions}
                    />
                    <br/>
                    <br/>
                </div>

                {/* Calendar to choose date */}
                <div>
                    <Label size='large'>Date:</Label>
                    <Field
                        name='date'
                        dateChange = {dateChange}
                        selectedDate = {selectedDate}
                        component={WrappedDatePicker}

                    />
                    <br/>
                    <br/>
                </div>

                {/* Set up timeblock duration */}
                <div>
                    <Label size='large'>Duration:</Label>
                    <br/>
                    <Field
                        name='start'
                        component={WrappedTimePicker}
                        time={startTime}
                        timeChange={startTimeChange}
                        icon='clock'
                        labelPosition='left'
                        placeholder='Start Time'
                    />
                    <Field
                        name='end'
                        component={WrappedTimePicker}
                        time={endTime}
                        timeChange={endTimeChange}
                        icon='clock'
                        labelPosition='left'
                        placeholder='End Time'
                    />
                    <br/>
                    <br/>
                </div>

                {/* Set recurrence options */}
                <div>
                    <Label size='large'>Repeating Options:</Label>
                    <br/>
                    <Field
                        name='repeating'
                        component={Dropdown}
                        placeholder='Select repeating type'
                        selection
                        options={repeatingOptions}
                    />
                    <br />
                    <br />
                </div>

                <Button color='green' type='submit' content='Save Availability'/>
                <Button color='red' type='button' onClick={cancel} content='Cancel'/>
                <Divider />
            </Form>
        </div>
    )

}

/* Redux Form */
export default reduxForm({
    form: 'timeblockForm',
    validate
})(TimeblockForm);
