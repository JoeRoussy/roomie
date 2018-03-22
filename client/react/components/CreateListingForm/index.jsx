import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Icon, Button, Message } from 'semantic-ui-react';
import { LabelInputField, TextAreaField, Checkbox, SelectField } from 'react-semantic-redux-form';

import RenderDropzone from '../RenderDropzone';
import { isInteger, isPrice, isFullOrHalfInt, isPostalCode } from '../../../../common/validation';
import { listingTypes } from '../../../../common/constants';

const validate = (values) => {
    let errors = {};

    const {
        name,
        description,
        province,
        postalCode,
        city,
        street,
        type,
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

    if (!province) {
        errors = {
            province: 'Please select a province.',
            ...errors
        };
    }

    if (!postalCode) {
        errors = {
            postalCode: 'Please enter a postal code.',
            ...errors
        };
    } else if (!isPostalCode(postalCode)) {
        errors = {
            postalCode: 'Please enter a valid postal code.',
            ...errors
        };
    }

    if (!city) {
        errors = {
            city: 'Please enter the city of the listing.',
            ...errors
        };
    }

    if (!street) {
        errors = {
            street: 'Please enter the street address of the listing.',
            ...errors
        };
    }

    if (!type) {
        errors = {
            type: 'Please select the type of listing.',
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
const CreateListingForm = ({
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
    <Form id='createListingForm' onSubmit={onSubmit(formData)} error={!!(errorMessage || provinceErrorMessage)}>
        <Message
            error
            header='Error'
            content={errorMessage ? errorMessage : provinceErrorMessage}
        />
        <Field
            name='name'
            component={LabelInputField}
            label='Name'
            labelPosition='left'
            placeholder='Listing Name'
        />
        <Field
            name='country'
            component={LabelInputField}
            label='Country'
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
            onChange={onProvinceSelect}
        />
        <Field
            name='city'
            component={SelectField}
            label='City'
            options={cities}
            placeholder='Select a city'
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
        <div id='checkboxWrapper'>
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
        </div>
        <Field
            name='images'
            component={RenderDropzone}
            multiple
            onImageDrop={onImageDrop}
            onImageRemove={onImageRemove}
            accept="image/*"
        />
        <Button type='submit' color='green' loading={isProcessing} disabled={!valid || isProcessing}>Create</Button>
    </Form>
)

export default reduxForm({
    form: 'createListingForm',
    validate
})(CreateListingForm);
