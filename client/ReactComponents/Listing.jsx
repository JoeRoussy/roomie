import React from 'react';
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { getListings } from '../redux/actions/listingsActions';


@connect((store)=>{
	return {
    listings: store.listingsReducer.listings
	}
})

export default class Listings extends React.Component {
  RetrievetListings() {
      this.props.dispatch(getListings());
  }
  componentWillMount() {
      // this.props.dispatch(getListings());
  }

  render() {
    const { listings } = this.props;

    if (!listings.length) {
      return <Button onClick={this.RetrievetListings.bind(this)} >Get Listings</Button>
    }

    const mappedListings = listings.map((listing, i) => {
        return <li key={i} >{listing.name}, {listing.address}, {listing.views} </li>
    });

    return (
      <div>
        <span>Listings:</span>
        <ul> {mappedListings} </ul>
      </div>
    )
  }
}
