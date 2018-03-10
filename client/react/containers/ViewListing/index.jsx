import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Item, Icon, Image, Label } from 'semantic-ui-react';

import { getListingById } from '../../../redux/actions/listingsActions';
import MapComponent from  '../../components/Map/Map';

import './styles.css';

@connect((store) => ({
    listing: store.listingsReducer.listing
}))

export default class ViewListing extends React.Component {
    constructor(props) {
        super(props);

        this.listingId = this.props.match.params.id;
    }

    componentWillMount() {
        this.props.dispatch(getListingById(this.listingId));
    }

    render() {
        const { listing } = this.props;
        console.log(listing)
        const position = {
          // lat: listing.lat,
          // lng: listing.lng
            lat: 37.762,
            lng: 37.762
        }
        return (
            <div>
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
                              </Item.Extra>
                          </Item.Content>
                    </Item>
                </Item.Group>

                <div style= {{margin:'auto'}}>
                  <MapComponent position={position} />
                </div>
            </div>
        )
    }
}
