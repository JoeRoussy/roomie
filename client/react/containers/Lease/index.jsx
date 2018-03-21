import React from 'react';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import { push } from 'react-router-redux';
import moment from 'moment'
import LeaseForm from '../../components/LeaseForm';
import { submitForm, searchForTenants, addTenant, removeTenant } from '../../../redux/actions/leaseActions';

const Lease = ({
    user,
    errorMessage,
    listing,
    tenants,
    searchResults,
    searchLoading,
    onSubmit,
    onCancel,
    onUserRemove,
    formValues,
    onSearchResultSelected,
    onSearchChange,
    startTime,
    endTime,
    startTimeChange,
    endTimeChange
}) =>{
    return (
        <LeaseForm
            errorMessage={errorMessage}
            onSubmit={onSubmit}
            onCancel={onCancel}
            user={user}
            listing={listing}
            tenants={tenants}
            searchResults={searchResults}
            searchLoading={searchLoading}
            onSearchChange={onSearchChange}
            onUserRemove = {onUserRemove}
            onSearchResultSelected={onSearchResultSelected}
            startTimeChange = {startTimeChange}
            endTimeChange = {endTimeChange}
            startTime = {startTime}
            endTime = {endTime}
            formValues = {formValues}
            initialValues = {{
                start: moment().startOf('hour'),
                end: moment().startOf('month').add(1,'month')
            }}
        />
    )
}

const mapStateToProps = ({
    userReducer: {
        user
    } = {},
    leaseReducer: {
        errorMessage,
        listing,
        tenants,
        searchLoading,
        searchResults
    } = {},
    form: {
        leaseForm: {
            values: formValues
        } = {}
    } = {}
}) => ({
    errorMessage,
    user,
    listing,
    tenants,
    searchLoading,
    searchResults,
    formValues,
    selectedDate: formValues ? formValues.date:null,
    startTime: formValues ? formValues.start:null,
    endTime: formValues ? formValues.end:null
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (formValues, tenants) => () => {
        dispatch(submitForm(formValues, tenants));
        dispatch(push('/my-listing'));
    },
    onCancel: (path) => () => dispatch(push(path)),
    onSearchResultSelected: (e, data) => {
        const {
            result: selectedUser
        } = data;
        dispatch(addTenant(selectedUser));
    },
    onSearchChange: (e, data) => {
        const {
            value
        } = data;
        if(value.length >= 3){
            dispatch(searchForTenants(value))
        }
    },
    onUserRemove: (user) => () => {
        dispatch(removeTenant(user))
    },
    startTimeChange: (time) => dispatch(change('leaseForm', 'start', time)),
    endTimeChange: (time) => dispatch(change('leaseForm', 'end', time)),

});

export default connect(mapStateToProps, mapDispatchToProps)(Lease);
