import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Card } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import { push } from 'react-router-redux';

import { getMyListings } from '../../../redux/actions/listingActions';
import ListingCard from '../../components/ListingCard';

import './styles.css';

@connect(({
    listingReducer: {
        myListings
    } = {},
    userReducer: {
        user
    } = {}
}) => ({
    myListings,
    user
}))

export default class MyListings extends React.Component {
    constructor(props) {
        super(props);

        this.mapListings = this.mapListings.bind(this);
        this.viewListing = this.viewListing.bind(this);
    }

    componentWillMount() {
        // Get all the listings for this user.
        this.props.dispatch(getMyListings());
    }

    // Map all the listings.
    mapListings = (listings) => listings.map((listing, i) =>
        <ListingCard key = { i } listing = { listing } id = { i } viewListing = { () => this.viewListing(listing) } />)

    // Called when a listing card is clicked.
    // Route to the appropriate listing page using the id.
    viewListing(listing) {
        // Route to the view listing page with the id of this listing
        const path = `/listings/${listing._id}`;
        this.props.dispatch(push(path));
    }

    render() {
        const {
            myListings,
            user
        } = this.props;

        const redirectSection = user ? '' : <Redirect to='/sign-in'/>;

        let body;

        body = myListings.length ? (
            <Card.Group>
                { this.mapListings(myListings) }
            </Card.Group>
        ) : (
            <p>No listings found.</p>
        );

        return (
            <Container>
                {redirectSection}
                {body}
            </Container>
        )
    }
}
