import React from 'react';
import { connect } from 'react-redux';

import CreateListingForm from '../../components/CreateListingForm';

import { submitCreateForm } from '../../../redux/actions/listingActions';

const CreateListing = ({
    onSubmit,
    formData,
    isFormProcessing,
    errorMessage
}) => {
    return (
        <div>
            <h1>Create Listing</h1>
            <CreateListingForm
                onSubmit={onSubmit(formData)}
                formData={formData}
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
        createListingForm: {
            values
        } = {}
    } = {}
}) => ({
    isFormProcessing,
    formData: values,
    errorMessage
})

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (formData) => () => dispatch(submitCreateForm(formData))
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateListing);
