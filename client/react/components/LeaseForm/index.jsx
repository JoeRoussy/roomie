import React from 'react';
import { Field, reduxForm, } from 'redux-form';
import { Form, Icon, Button, Search, Input, Card, Divider } from 'semantic-ui-react';
import { LabelInputField } from 'react-semantic-redux-form';

import WrappedDatePicker from '../WrappedDatePicker';
import ProfileCard from '../ProfileCard';
import { isPrice } from '../../../../common/validation';
import ListingCard from '../ListingCard';

import './styles.css';

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
    if(arr.length === 0) {
        return (<h3> No participants Selected </h3>);
    }

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

    return (
        <Card.Group className='centered'>
            {result}
        </Card.Group>
    );
}

const LeaseForm = ({
    errorMessage,
    onSubmit,
    onCancel,
    formValues,
    user,
    listing,
    viewListing,
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
}) => (
    <Form id='createLeaseForm' onSubmit={onSubmit(formValues, listing, tenants)} error={!!(errorMessage)}>
        <Card.Group className='centered'>
            <ListingCard
                listing={listing}
                viewListing={viewListing}
            />
        </Card.Group>

        <Divider />    

        {mapToList(tenants, onUserRemove)}

        <div id='leaseFormRoommateSearch'>
            <Search
                placeholder = 'Search by name...'
                results={searchResults}
                loading={searchLoading}
                onResultSelect={onSearchResultSelected}
                onSearchChange={onSearchChange}
            />
        </div>
        
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
            type = 'number'
            min = '1'
        />

        <div id='createLeaseFormSubmitSectionWrapper'>
            <Button type='submit' color='green'> Create </Button>
            <Button type='button' color='red' onClick={onCancel('/my-listings')}> Cancel </Button>
        </div>
    </Form>
);

export default reduxForm({
    form: 'leaseForm',
    validate
})(LeaseForm);