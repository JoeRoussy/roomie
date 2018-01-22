import React from 'react';
import { Item, Image } from 'semantic-ui-react';

export default class SingleListing extends React.Component {

  render() {
    const { listing } = this.props;

    return (
      <div>
          <h4> {listing.name} </h4>
      </div>
    )
  }
}
