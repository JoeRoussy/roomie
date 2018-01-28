import React, {Component} from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Button, Card, Icon, Image } from 'semantic-ui-react';

import { getListings } from '../../redux/actions/listingsActions';

import ListingCard from '../components/ListingCard';

@connect((store) => {
	return {
        listings: store.listingsReducer.listings
	}
})

export default class Listings extends React.Component {
    constructor() {
        super();

        this.mapListings = this.mapListings.bind(this);
        this.refreshListings = this.refreshListings.bind(this);
        this.viewListing = this.viewListing.bind(this);
    }

    componentWillMount() {
        this.props.dispatch(getListings());
    }

    mapListings = (listings) => {
        // Take all the listings and map them each to a listing card
        return listings.map((listing, i) => {
            return <ListingCard key = { i } listing = { listing } id = { i } viewListing = { () => this.viewListing(listing) } />;
        });
    }

    refreshListings() {
        this.props.dispatch(getListings());
    }

    // Called when a listing card is clicked.
    // Route to the appropriate listing page using the id.
    viewListing(listing) {
        // Route to the view listing page with the id of this listing
        const path = `/listings/${listing._id}`;
        this.props.dispatch(push(path));
    }

    render() {
        const { listings } = this.props;

        const body = listings.length ? (
            <Card.Group>
                { this.mapListings(listings) }
            </Card.Group>
        ) : (
            <p>No listings found</p>
        );
        
        return (
            <div>
                <Button onClick= { this.refreshListings } >Refresh Listings</Button>
                <div>
                    {body}
                </div>
            </div>
        )
    }
}
