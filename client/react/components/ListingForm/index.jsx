import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Icon, Button, Message } from 'semantic-ui-react';
import { LabelInputField, TextAreaField, Checkbox, SelectField } from 'react-semantic-redux-form';

import RenderDropzone from '../RenderDropzone';
import { isInteger, isPrice, isFullOrHalfInt, isPostalCode } from '../../../../common/validation';
import { listingTypes } from '../../../../common/constants';

// TODO: Add validation
const validate = (values) => {
    let errors = {};

    return errors;
}

// NOTE: Valid is a prop passed in by redux-form
const ListingForm = ({
    onSubmit,
    isProcessing,
    valid,
    errorMessage,
    provinceErrorMessage,
    onImageDrop,
    onImageRemove,
    onProvinceSelect,
    provinces,
    cities,
    formData
}) => (
    <Form onSubmit={onSubmit(formData)} error={!!(errorMessage || provinceErrorMessage)}>
        <Message
            error
            header='Error'
            content={errorMessage ? errorMessage : provinceErrorMessage}
        />
        <Field
            name='name'
            component={LabelInputField}
            label={{ content: <Icon color='blue' name='home' size='large' /> }}
            labelPosition='left'
            placeholder='Listing Name'
        />
        <Field
            name='country'
            component={LabelInputField}
            label={{ content: <Icon color='blue' name='globe' size='large' /> }}
            labelPosition='left'
            placeholder='Canada'
            readOnly
            value='Canada'
        />
        <Field
            name='province'
            component={SelectField}
            label='Province'
            options={provinces}
            placeholder='Select a province'
            style={{marginTop: 0 + 'px'}}
            onChange={onProvinceSelect}
        />
        <Field
            name='city'
            component={SelectField}
            label='City'
            options={cities}
            placeholder='Select a city'
            style={{marginTop: 0 + 'px'}}
        />
        <Field
            name='postalCode'
            component={LabelInputField}
            label='Postal Code'
            labelPosition='left'
            placeholder='Postal Code'
        />
        <Field
            name='street'
            component={LabelInputField}
            label='Street Address'
            labelPosition='left'
            placeholder='Street Address'
        />
        <Field
            name='unit'
            component={LabelInputField}
            label='Unit Number (Optional)'
            labelPosition='left'
            placeholder='Unit Number'
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
