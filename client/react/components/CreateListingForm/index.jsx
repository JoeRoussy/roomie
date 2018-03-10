import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Icon, Button, Message } from 'semantic-ui-react';
import { LabelInputField, TextAreaField, Checkbox, SelectField } from 'react-semantic-redux-form';

import RenderDropzone from '../RenderDropzone';

const listingTypes = [
  { key: 'select', value:'', text:'Choose One' },
  { key: 'one', value: 'apartment', text: 'Apartment' },
  { key: 'two', value: 'condo', text: 'Condominium' },
  { key: 'three', value: 'house', text: 'House'},
  { key: 'four', value: 'townhouse', text: 'Town House'},
  { key: 'five', value: 'other', text: 'Other'}
]

// TODO: Update validation with all required fields
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
const CreateListingForm = ({
    onSubmit,
    isProcessing,
    valid,
    errorMessage
}) => (
    <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Message
            error
            header='Error'
            content={errorMessage}
        />
        <Field
            name='name'
            component={LabelInputField}
            label={{ content: <Icon color='blue' name='home' size='large' /> }}
            labelPosition='left'
            placeholder='Listing Name'
        />
        <Field
            name='address'
            component={LabelInputField}
            label={{ content: <Icon color='blue' name='map pin' size='large' /> }}
            labelPosition='left'
            placeholder='Address'
        />
        <Field
            name='price'
            component={LabelInputField}
            label='Price per month'
            labelPosition='left'
            placeholder=''
        />
        <Field
            name='description'
            component={TextAreaField}
            label='Description'
            placeholder='Describe the listing'
        />
        <Field
            name='type'
            component={SelectField}
            label='Type of listing'
            options={listingTypes}
            placeholder='Type of listing'
            style={{marginTop: 0 + 'px'}}
        />
        <Field
            name='bedrooms'
            component={LabelInputField}
            label='Number of bedrooms'
            labelPosition='left'
            placeholder=''
        />
        <Field
            name='bathrooms'
            component={LabelInputField}
            label='Number of bathrooms'
            labelPosition='left'
            placeholder=''
        />
        <Field
            name='utilities'
            component={Checkbox}
            label='Utilities'
        />
        <Field
            name='furnished'
            component={Checkbox}
            label='Furnished'
        />
        <Field
            name='parking'
            component={Checkbox}
            label='Parking'
        />
        <Field
            name='internet'
            component={Checkbox}
            label='Internet'
        />
        <Field
            name='laundry'
            component={Checkbox}
            label='Laundry'
        />
        <Field
            name='airconditioning'
            component={Checkbox}
            label='Air Conditioning'
        />
        <Field
            name='images'
            component={RenderDropzone}
        />
        <Button type='submit' color='green' loading={isProcessing} disabled={!valid || isProcessing}>Create</Button>
    </Form>
)

export default reduxForm({
    form: 'createListingForm',
    validate
})(CreateListingForm);
