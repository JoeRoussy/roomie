import React from 'react';
import { connect } from 'react-redux';

import EditListing from '../../components/EditListing';
import { submitForm } from '../../../redux/actions/listingsActions';

const ManageListing = ({
    onSubmit,
    formValues,
    isFormProcessing,
    errorMessage
}) => {
    return (
        <div>
            <h1>Create Listing</h1>
            <EditListing
                onSubmit={onSubmit}
                formValues={formValues}
                isFormProcessing={isFormProcessing}
                errorMessage={errorMessage}
            />
        </div>
    );
};

const mapStateToProps = ({
    listingsReducer: {
        isFormProcessing,
        errorMessage
    } = {},
    form: {
        listingForm: {
            values
        } = {}
    } = {}
}) => ({
    isFormProcessing,
    formValues: values,
    errorMessage
})

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (formData) => () => dispatch(submitForm(formData))
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageListing);
