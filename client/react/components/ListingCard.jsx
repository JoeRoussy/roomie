import React from 'react';
import { Card, Icon, Image } from 'semantic-ui-react';

const ListingCard = ({
    listing,
    id
}) => (
    <Card
        header = {listing.name}
        meta = {listing.address}
        description = {listing.description}
        extra = { <a><Icon name = 'user' />{ listing.views } Views</a> }
        key = { id }
    />
)

export default ListingCard;
