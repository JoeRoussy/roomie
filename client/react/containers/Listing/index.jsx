import React, { Component } from 'react';
import { connect } from 'react-redux';
import { arrayPush, arrayRemove } from 'redux-form';
import { Container, Button, Item, Icon, Image, Label } from 'semantic-ui-react';

import ListingForm from '../../components/ListingForm';
import ListingDisplay from '../../components/ListingDisplay';

import {
    getListingById,
    editListing,
    submitUpdateForm,
    cancelEditListing
} from '../../../redux/actions/listingActions';

@connect(({
    listingReducer: {
        listing,
        isEditing,
        isFormProcessing,
        errorMessage
    } = {},
    userReducer: {
        user
    } = {},
    form: {
        listingForm: {
            values
        } = {}
    } = {}
}) => ({
    listing,
    user,
    formData: values,
    isEditing,
    isFormProcessing,
    errorMessage
}))

export default class Listing extends React.Component {
    constructor(props) {
        super(props);

        this.listingId = this.props.match.params.id;
        this.editListing = this.editListing.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onImageDrop = this.onImageDrop.bind(this);
        this.onImageRemove = this.onImageRemove.bind(this);
        this.onEditCancelClicked = this.onEditCancelClicked.bind(this);
    }

    componentWillMount() {
        this.props.dispatch(getListingById(this.listingId));
    }

    editListing() {
        this.props.dispatch(editListing());
    }

    onSubmit(formData) {
        this.props.dispatch(submitUpdateForm(formData, this.listingId));
    }

    onEditCancelClicked() {
        this.props.dispatch(cancelEditListing());
    }

    onImageDrop(images) {
        images.forEach((image) => this.props.dispatch(arrayPush('listingForm', 'images', image)));
    }

    onImageRemove(imageIndex) {
        this.props.dispatch(arrayRemove('listingForm', 'images', imageIndex));
    }

    render() {
        const {
            listing,
            user,
            isEditing,
            isFormProcessing,
            errorMessage,
            formData
        } = this.props;

        let editButton;

        editButton = (user && listing && user.isLandlord && user._id === listing.ownerId) ? (
            <Button onClick = { this.editListing }>Edit listing</Button>
        ) : ('');

        let bodySection;

        if (isEditing && listing) {
            bodySection = (
                <div>
                    <h1>Edit Listing</h1>
                    <div>
                        <p>{listing.location}</p>
                    </div>
                    <ListingForm
                        onSubmit={(formData) => () => this.onSubmit(formData)}
                        onEditCancelClicked={ this.onEditCancelClicked }
                        initialValues={{ ...listing }}
                        isProcessing={ isFormProcessing }
                        errorMessage={ errorMessage }
                        onImageDrop={(images) => this.onImageDrop(images)}
                        onImageRemove={(imageIndex) => () => this.onImageRemove(imageIndex)}
                        formData={formData}
                    />
                </div>
            );
        } else if (listing) {
            bodySection = (
                <div>
                    <ListingDisplay
                        listing={ listing }
                    />
                    {editButton}
                </div>
            );
        } else {
            bodySection = '';
        }

        return (
            <Container>
                {bodySection}
            </Container>
        )
    }
}
