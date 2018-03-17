import React from 'react';
import { connect } from 'react-redux';
import { arrayPush, arrayRemove } from 'redux-form';
import { Redirect } from 'react-router';

import CreateListingForm from '../../components/CreateListingForm';
import { submitCreateForm } from '../../../redux/actions/listingActions';
import { getProvinces, getCitiesForProvince } from '../../../redux/actions/locationActions';

import './styles.css';

@connect(({
    listingsReducer: {
        isFormProcessing,
        errorMessage
    } = {},
    form: {
        createListingForm: {
            values
        } = {}
    } = {},
    locationReducer: {
        errorMessage: provinceErrorMessage,
        cities,
        provinces
    } = {},
    userReducer: {
        user
    } = {}
}) => ({
    formData: values,
    errorMessage,
    provinceErrorMessage,
    provinces,
    cities,
    isFormProcessing,
    user
}))

export default class CreateListing extends React.Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onImageDrop = this.onImageDrop.bind(this);
        this.onImageRemove = this.onImageRemove.bind(this);
        this.onProvinceSelect = this.onProvinceSelect.bind(this);
    }

    componentWillMount() {
        this.props.dispatch(getProvinces());
    }

    onSubmit(formData) {
        this.props.dispatch(submitCreateForm(formData));
    }

    onImageDrop(images) {
        images.forEach((image) => this.props.dispatch(arrayPush('createListingForm', 'images', image)));
    }

    onImageRemove(imageIndex) {
        this.props.dispatch(arrayRemove('createListingForm', 'images', imageIndex));
    }

    onProvinceSelect(e, province) {
        this.props.dispatch(getCitiesForProvince(province));
    }

    render() {
        const {
            isFormProcessing,
            errorMessage,
            provinceErrorMessage,
            formData,
            provinces,
            cities,
            user
        } = this.props;

        const redirectSection = !user.isLandlord ? (<Redirect to='/' />) : '';

        return (
            <div>
                {redirectSection}
                <h1>Create Listing</h1>
                <CreateListingForm
                    onSubmit={(formData) => () => this.onSubmit(formData)}
                    isFormProcessing={isFormProcessing}
                    errorMessage={errorMessage}
                    provinceErrorMessage={provinceErrorMessage}
                    onImageDrop={(images) => this.onImageDrop(images)}
                    onImageRemove={(imageIndex) => () => this.onImageRemove(imageIndex)}
                    provinces={provinces}
                    onProvinceSelect={(e, province) => this.onProvinceSelect(e, province)}
                    cities={cities}
                    formData={formData}
                />
            </div>
        )
    }
}
