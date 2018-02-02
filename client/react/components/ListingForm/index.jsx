import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Icon, Button, Message } from 'semantic-ui-react';
import { LabelInputField, TextAreaField } from 'react-semantic-redux-form';

const validate = (values) => {
    let errors = {};

    const {
        name,
        address,
        description,
        location
    } = values;

    if (!name) {
        errors = {
            name: 'Please a name for the listing.',
            ...errors
        };
    }

    if (!description) {
        errors = {
            description: 'Please enter a description for the listing.',
            ...errors
        };
    }

    if (!address) {
        errors = {
            address: 'Please enter the address of the listing.',
            ...errors
        };
    }

    if (!location) {
        errors = {
            location: 'Please enter the location of the listing.',
            ...errors
        };
    }

    return errors;
}

// NOTE: Valid is a prop passed in by redux-form
const ListingForm = ({
    onSubmit,
    isProcessing,
    valid,
    errorMessage,
    className
}) => (
    <Form className={className} onSubmit={onSubmit} error={!!errorMessage}>
        <Message
            error
            header='Error'
            content={errorMessage}
        />
        <Field
            name='name'
            component={LabelInputField}
            label={{ content: <Icon color='blue' name='rebel' size='large' /> }}
            labelPosition='left'
            placeholder='Listing Name'
        />
        <Field
            name='address'
            component={LabelInputField}
            label={{ content: <Icon color='blue' name='map signs' size='large' /> }}
            labelPosition='left'
            placeholder='Address'
        />
        <Field
            name='description'
            component={LabelInputField}
            label={{ content: <Icon color='blue' name='empire' size='large' /> }}
            labelPosition='left'
            placeholder='Description'
        />
        <Field
            name='location'
            component={LabelInputField}
            label={{ content: <Icon color='blue' name='map outline' size='large' /> }}
            labelPosition='left'
            placeholder='Location'
        />
    <Button type='submit' color='green' loading={isProcessing} disabled={!valid || isProcessing}>Create</Button>
    </Form>
)

export default reduxForm({
    form: 'listingForm',
    validate
})(ListingForm);
