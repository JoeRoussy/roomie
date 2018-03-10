import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Button, Item, Icon, Image, Label } from 'semantic-ui-react';

import ListingForm from '../../components/ListingForm';
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
                    onSubmit={() => this.onSubmit(formData)}
                    onEditCancelClicked={ this.onEditCancelClicked }
                    initialValues={{ ...listing }}
                    isProcessing={ isFormProcessing }
                    errorMessage={ errorMessage }
                />
            );
        } else if (listing) {
            bodySection = (
                <Item.Group divided>
                    <Item>
                          <Item.Content>
                              <Item.Header as='a'>{ listing.name }</Item.Header>
                              <Item.Meta>
                                  <span className='address'>{ listing.address }</span>
                              </Item.Meta>
                              <Item.Description>{ listing.description }</Item.Description>
                              <Item.Extra>
                                  <Label icon='globe' content='View Map' />
                                  {editButton}
                              </Item.Extra>
                          </Item.Content>
                    </Item>
                </Item.Group>
            );
        } else {
            bodySection = '';
        }

        return (
            <div>
                {bodySection}
            </div>
        )
    }
}
