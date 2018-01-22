import React from 'react';
import { Button, Card, Icon, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { getListings } from '../../redux/actions/listingsActions';


@connect((store)=>{
	return {
    listings: store.listingsReducer.listings
	}
})

export default class Listings extends React.Component {
  retrievetListings() {
      this.props.dispatch(getListings());
  }

  mapListings (listing, i) {
    const extra = (
      <a>
        <Icon name = 'user' />
        { listing.views } Views
      </a>
    )
      return (
        <Card
          header = {listing.name}
          meta = {listing.address}
          description = {listing.description}
          extra = { extra }
          key = { i }
        />
      )
  }

  componentWillMount() {
      // this.props.dispatch(getListings());
  }

  render() {
    const { listings } = this.props;

    if (!listings.length) {
      return <Button onClick={this.retrievetListings.bind(this)} >Get Listings</Button>
    }

    const mappedListings = listings.map((listing, i) => {
      return this.mapListings(listing, i);
    });

    return (
      <div>
        <Button onClick={this.retrievetListings.bind(this)} >Refresh Listings</Button>
        <Card.Group>
          { mappedListings }
        </Card.Group>
      </div>
    )
  }
}
