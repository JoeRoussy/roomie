import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Button, Card, Icon, Image } from 'semantic-ui-react';

import { getListings } from '../../redux/actions/listingsActions';

@connect((store)=>{
	return {
    listings: store.listingsReducer.listings
	}
})

export default class Listings extends React.Component {
    componentWillMount() {
        this.props.dispatch(getListings());
    }
    mapListings = (listings) => {
        // Take all the listings and map them each to a listing card
        return listings.map((listing, i) => (
            <Card
                header = {listing.name}
                meta = {listing.address}
                description = {listing.description}
                extra = { <a><Icon name = 'user' />{ listing.views } Views</a> }
                key = { i }
            />
        ));
    }
    refreshListings() {
        this.props.dispatch(getListings());
    }
    render() {
        const { listings } = this.props;
        return (
            <div>
                <Button onClick={this.refreshListings.bind(this)} >Refresh Listings</Button>
                <Card.Group>
                    { this.mapListings(listings) }
                </Card.Group>
            </div>
        )
    }
}
