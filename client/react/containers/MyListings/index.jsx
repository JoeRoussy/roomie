import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Card } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import { push } from 'react-router-redux';

import { getMyListings, deletingListing, cancelDeletingListing, deleteMyListing } from '../../../redux/actions/listingActions';
import ListingCard from '../../components/ListingCard';
import DeleteItemModal from '../../components/DeleteItemModal';

import './styles.css';

@connect(({
    listingReducer: {
        myListings,
        isDeleting,
        listingToDelete
    } = {},
    userReducer: {
        user
    } = {}
}) => ({
    myListings,
    isDeleting,
    listingToDelete,
    user
}))

export default class MyListings extends React.Component {
    constructor(props) {
        super(props);

        this.mapListings = this.mapListings.bind(this);
        this.viewListing = this.viewListing.bind(this);
        this.deletingListing = this.deletingListing.bind(this);
        this.cancelDeletingListing = this.cancelDeletingListing.bind(this);
        this.deletingListingConfirmed = this.deletingListingConfirmed.bind(this);
    }

    componentWillMount() {
        // Get all the listings for this user.
        this.props.dispatch(getMyListings());
    }

    // Map all the listings.
    mapListings = (listings) => listings.map((listing, i) =>
        <ListingCard
            key = { i }
            listing = { listing }
            id = { i }
            canDelete = { true }
            viewListing = { () => this.viewListing(listing) }
            deleteListing = { () => this.deletingListing(listing) }
        />
    )

    // Called when a listing card is clicked.
    // Route to the appropriate listing page using the id.
    viewListing(listing) {
        // Route to the view listing page with the id of this listing
        const path = `/listings/${listing._id}`;
        this.props.dispatch(push(path));
    }

    deletingListing(listing) {
        this.props.dispatch(deletingListing(listing));
    }

    cancelDeletingListing() {
        this.props.dispatch(cancelDeletingListing());
    }

    deletingListingConfirmed(listing) {
        this.props.dispatch(deleteMyListing(listing._id));
    }

    render() {
        const {
            myListings,
            user,
            isDeleting,
            listingToDelete
        } = this.props;

        const redirectSection = user ? '' : <Redirect to='/sign-in'/>;

        const body = myListings.length ? (
            <Card.Group>
                { this.mapListings(myListings) }
            </Card.Group>
        ) : (
            <p>No listings found.</p>
        );

        const deleteModal = isDeleting && listingToDelete ? (
            <DeleteItemModal
                header = 'Deleting Listing'
                content = { `Are you sure you want to delete the listing: ${listingToDelete.name}` }
                onAccept = { () => this.deletingListingConfirmed(listingToDelete) }
                onDecline = { this.cancelDeletingListing }
                displayModal = { isDeleting }
            />
        ) : ('');

        return (
            <Container id='myListingsWrapper' className='rootContainer'>
                {redirectSection}
                {body}
                {deleteModal}
            </Container>
        )
    }
}
