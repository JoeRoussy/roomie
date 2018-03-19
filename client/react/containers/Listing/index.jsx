import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Container, Button, Item, Icon, Image, Label } from 'semantic-ui-react';
import { push } from 'react-router-redux'; // TODO: Should probably use nagivateTo in components but there was wierd transpiling issues

import ListingForm from '../../components/ListingForm';
import ListingDisplay from '../../components/ListingDisplay';

import { addLandlord, setListing } from '../../../redux/actions/scheduleMeetingActions';
import {
    getListingById,
    editListing,
    submitForm,
    cancelEditListing
} from '../../../redux/actions/listingActions';

@connect(({
    listingReducer: {
        listing,
        isEditing,
        isFormProcessing,
        errorMessage,
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
        this.onEditCancelClicked = this.onEditCancelClicked.bind(this);
        this.onBookMeetingClicked = this.onBookMeetingClicked.bind(this);
    }

    componentWillMount() {
        this.props.dispatch(getListingById(this.listingId));
    }

    editListing() {
        this.props.dispatch(editListing());
    }

    onSubmit(formData) {
        this.props.dispatch(submitForm(formData));
    }

    onEditCancelClicked() {
        this.props.dispatch(cancelEditListing());
    }

    onBookMeetingClicked(listing) {
        if (listing) {
            return () => {
                this.props.dispatch(addLandlord(listing.owner));
                this.props.dispatch(setListing(listing));
                this.props.dispatch(push('/schedule-meeting'));
            }
        } else {
            return () => this.props.dispatch(push('/schedule-meeting'));
        }
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
        editButton = user && user.isLandlord ? (
            <Button onClick = { this.editListing }>Edit listing</Button>
        ) : ('');

        let bodySection;

        if (isEditing) {
            bodySection = (
                <ListingForm
                    onSubmit={(formData) => () => this.onSubmit(formData)}
                    onEditCancelClicked={ this.onEditCancelClicked }
                    initialValues={{ ...listing }}
                    isProcessing={ isFormProcessing }
                    errorMessage={ errorMessage }
                />
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
                <Button onClick={this.onBookMeetingClicked(listing)}>Book a Meeting</Button>
            </Container>
        )
    }
}
