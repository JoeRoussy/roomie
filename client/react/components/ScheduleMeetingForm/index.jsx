import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import moment from 'moment';
import { Input, Dropdown } from 'react-semantic-redux-form';
import { Button, Form, Label, Message } from 'semantic-ui-react';
import WrappedDatePicker from '../WrappedDatePicker';
import WrappedTimePicker from '../WrappedTimePicker';

/* Validation */
const validate = (formValues) => {
    let errors = {};
    const {
        date,
        start,
        end,
    } = formValues;
    const now = moment();

    if (!date) {
        errors = {
            date: 'Please select a date',
            ...errors
        };
    } else if (now.diff(date, 'days') < 0){
        errors = {
            date: 'Please select a date that is today or later',
            ...errors
        }
    }

    if (!start) {
        errors = {
            start: 'Please select a start time',
            ...errors
        };
    }

    if (!end) {
        errors = {
            end: 'Please select a end time',
            ...errors
        };
    }

    if (!start && !end && start.diff(end, 'minutes') < 0) {
        errors = {
            start: 'Please select a start time that is earlier than end time',
            end: 'Please select a end time that is later than start time',
            ...errors
        }
    }

    return errors;
}

/* Main class */
const ScheduleMeetingForm = ({
    onSubmit,
    formValues,
    errorMessage,
    dateChange,
    selectedDate,
    startTime,
    endTime,
    startTimeChange,
    endTimeChange,
    isLoading
}) => (
    <Form onSubmit={onSubmit(formValues)} error={!!errorMessage}>
        <Message
            error
            header='Error'
            content={errorMessage}
        />

        {/* Calendar to choose date */}
        <div>
            <Label size='large'>Date:</Label>
            <Field
                name='date'
                dateChange={dateChange}
                selectedDate={selectedDate}
                component={WrappedDatePicker}
            />
        </div>

        {/* Set up timeblock duration */}
        <div>
            <Label size='large'>Duration:</Label>
            <br />
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
                label='End'
                name='end'
                component={WrappedTimePicker}
                time={endTime}
                timeChange={endTimeChange}
                icon='clock'
                labelPosition='left'
                placeholder='End Time'
            />
        </div>

        <Button type='submit' color='green' content='Create Meeting' loading={isLoading} />
    </Form>
);

/* Redux Form */
export default reduxForm({
    form: 'scheduleMeetingForm',
    validate
})(ScheduleMeetingForm);
