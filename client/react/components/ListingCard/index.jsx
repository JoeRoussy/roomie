import React from 'react';
import { Card, Icon, Image } from 'semantic-ui-react';

import './styles.css'

const ListingCard = ({
    listing,
    id,
    viewListing
}) => (
    <Card
        header = { listing.name }
        meta = { listing.address }
        description = { listing.description }
        extra = { <span ><Icon name = 'user' />{ listing.views ? listing.views : '0' } Views</span> }
        key = { id }
        onClick = { viewListing }
    />
)

export default ListingCard;
