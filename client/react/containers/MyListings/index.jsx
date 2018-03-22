import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Card, Divider } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import { push } from 'react-router-redux';
import { populateForm } from '../../../redux/actions/leaseActions'
import { getMyListings, deletingListing, cancelDeletingListing, deleteMyListing } from '../../../redux/actions/listingActions';
import ListingCard from '../../components/ListingCard';
import LeaseCard from '../../components/LeaseCard';
import DeleteItemModal from '../../components/DeleteItemModal';

import './styles.css';

@connect(({
    listingReducer: {
        myListings,
        myLeases,
        isDeleting,
        listingToDelete
    } = {},
    userReducer: {
        user
    } = {}
}) => ({
    myListings,
    myLeases,
    isDeleting,
    listingToDelete,
    user
}))

export default class MyListings extends React.Component {
    constructor(props) {
        super(props);

        this.mapListings = this.mapListings.bind(this);
        this.mapLeases = this.mapLeases.bind(this);
        this.createLease = this.createLease.bind(this);
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
            canLease = { true }
            canDelete = { true }
            createLease = { () => this.createLease(listing) }
            viewListing = { () => this.viewListing(listing) }
            deleteListing = { () => this.deletingListing(listing) }
        />
    )

    mapLeases = (leases) => leases.map((lease, i) => (
        <LeaseCard
            id = {lease._id}
            lease={lease}
        />
    ));

    // Called when a listing card is clicked.
    // Route to the appropriate listing page using the id.
    viewListing(listing) {
        // Route to the view listing page with the id of this listing
        const path = `/listings/${listing._id}`;
        this.props.dispatch(push(path));
    }

    createLease(listing){
        const path = `/lease`;
        this.props.dispatch(populateForm(listing))
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
            myLeases,
            user,
            isDeleting,
            listingToDelete
        } = this.props;

        const redirectSection = user ? '' : <Redirect to='/sign-in'/>;

        const body = myListings.length ? (
            <div>
                <h1> My listings </h1>
                <Card.Group>
                    { this.mapListings(myListings) }
                </Card.Group>
            </div>
        ) : (
            <p>No listings found.</p>
        );

        let leaseCards = myLeases.length ? (
            <div>
                <h1> My leased listings </h1>
                <Card.Group>
                    {this.mapLeases(myLeases)}
                </Card.Group>
            </div>
        ) : (
            <h3> You currently have no listings leased </h3>
        )



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

                <Divider />

                <div>
                    {leaseCards}
                </div>
            </Container>
        )
    }
}
