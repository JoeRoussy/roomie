import React from 'react';
import { Field, reduxForm, } from 'redux-form';
import { Form, Icon, Button, Search, Input, Card } from 'semantic-ui-react';
import { LabelInputField } from 'react-semantic-redux-form';
import WrappedDatePicker from '../WrappedDatePicker';
import ProfileCard from '../ProfileCard';
import { isPrice } from '../../../../common/validation';

const validate = (values) => {
    let errors = {};

    const {
        price
    } = values;

    if (price && !isPrice(price)) {
        errors = {
            maxPrice: 'Please enter a valid price',
            ...errors
        };
    }
    return errors;
}


const mapToList = (arr, onUserRemove) => {
    if(arr.length === 0) return <h3> No participants Selected </h3>
    const result = arr.map(tenant => (
        <ProfileCard
            bottomExtras={(
                <Card.Content>
                    <Button color='red' type='button' onClick={onUserRemove(tenant)} basic>Remove</Button>
                </Card.Content>
            )}
            user={tenant.api_response}
            key={tenant.title}
        />
    ));
    return <Card.Group> {result} </Card.Group>;
}

const LeaseForm = ({
    errorMessage,
    onSubmit,
    onCancel,
    formValues,
    user,
    listing,
    tenants,
    searchResults,
    searchLoading,
    onSearchChange,
    onSearchResultSelected,
    onUserRemove,
    selectedDate,
    startTime,
    endTime,
    dateChange,
    startTimeChange,
    endTimeChange
}) => {
    const { 
        locationDisplay,
        location
    } = listing

    let placeholder = location;

    if(locationDisplay) 
        placeholder = locationDisplay;
    return (
        <Form onSubmit={onSubmit(formValues, listing, tenants)} error={!!(errorMessage)}>
            <Field
                name = 'location'
                component = {LabelInputField}
                label = 'Listing'
                placeholder = {placeholder}
                disabled
            />

            {mapToList(tenants, onUserRemove)}

            <Search
                placeholder = 'Search by name...'
                results={searchResults}
                loading={searchLoading}
                onResultSelect={onSearchResultSelected}
                onSearchChange={onSearchChange}
            />
            
            <Field
                name = 'start'
                component = {WrappedDatePicker}
                selectedDate={startTime}
                dateChange={startTimeChange}
                label = 'Start'
                placeholder = {startTime}
            />
            <Field
                name = 'end'
                component = {WrappedDatePicker}
                selectedDate= {endTime}
                dateChange = {endTimeChange}
                label = 'End'
                placeholder = {endTime}
            />
            <Field
                name = 'price'
                component = {LabelInputField}
                label = 'Price'
                placeholder = 'Price per month'
            />

            <Button type='submit' color='green'> Create </Button>
            <Button type='button' color='red' onClick={onCancel('/my-listings')}> Cancel </Button>

        </Form>
    )
}

export default reduxForm({
    form: 'leaseForm',
    validate
})(LeaseForm);