import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Button, Item, Icon, Image, Label } from 'semantic-ui-react';

import { getListingById } from '../../../redux/actions/listingsActions';

@connect((store) => ({
    listing: store.listingsReducer.listing,
    user: store.userReducer.user
}))

export default class ViewListing extends React.Component {
    constructor(props) {
        super(props);

        this.listingId = this.props.match.params.id;
        this.editListing = this.editListing.bind(this);
    }

    componentWillMount() {
        this.props.dispatch(getListingById(this.listingId));
    }

    editListing() {
        // TODO: Implement edit listing. This method will route to the manage listings page.
    }

    render() {
        const { listing, user } = this.props;
        let editButton = '';

        if (user)
        {
            editButton = user.isLandlord ? (<Button onClick = { this.editListing }> Edit listing</Button>) : ('');
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
                                  {editButton}
                              </Item.Extra>
                          </Item.Content>
                    </Item>
                </Item.Group>
            </div>
        )
    }
}
