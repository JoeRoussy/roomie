import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Icon, Button, Message } from 'semantic-ui-react';
import { LabelInputField, TextAreaField, Checkbox, SelectField } from 'react-semantic-redux-form';

import RenderDropzone from '../RenderDropzone';
import { isInteger, isPrice, isFullOrHalfInt } from '../../../../common/validation';
import { listingTypes } from '../../../../common/constants';

// TODO: Add validation
const validate = (values) => {
    let errors = {};

    const {
        name,
        description,
        price,
        bedrooms,
        bathrooms
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

    if (!price) {
        errors = {
            price: 'Please enter the price of the listing.',
            ...errors
        };
    } else if(!isPrice(price)) {
        errors = {
            price: 'Must input a price.',
            ...errors
        };
    }

    if(!bedrooms) {
        errors = {
            bedrooms: 'Please enter number of bedrooms.',
            ...errors
        };
    } else if(!isInteger(bedrooms)) {
        errors = {
            bedrooms: 'Must input number.',
            ...errors
        };
    }

    if(!bathrooms) {
        errors = {
            bathrooms: 'Please enter number of bathrooms.',
            ...errors
        };
    } else if(!isFullOrHalfInt(bathrooms)) {
        errors = {
            bathrooms: 'Must input half of full number of bathrooms.',
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
    onEditCancelClicked,
    errorMessage,
    onImageDrop,
    onImageRemove,
    formData
}) => (
    <Form onSubmit={onSubmit(formData)} error={!!(errorMessage)}>
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
            placeholder='Select type of listing'
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
            name='airConditioning'
            component={Checkbox}
            label='Air Conditioning'
        />
        <Field
            name='images'
            component={RenderDropzone}
            multiple
            onImageDrop={onImageDrop}
            onImageRemove={onImageRemove}
            accept="image/*"
        />
        <Button type='submit' color='green' loading={isProcessing} disabled={!valid || isProcessing}>Update</Button>
        <Button type='button' onClick={onEditCancelClicked} >Cancel</Button>
    </Form>
)

export default reduxForm({
    form: 'listingForm',
    validate
})(ListingForm);
