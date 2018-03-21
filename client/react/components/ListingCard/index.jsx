import React from 'react';
import { Card, Icon, Image, Button } from 'semantic-ui-react';

import './styles.css';

const ListingCard = ({
    listing,
    id,
    viewListing,
    canDelete = false,
    deleteListing
}) => (
    <Card
        header = { listing.name }
        meta = { listing.address }
        description = { listing.description }
        extra = {
                <span >
                    <Icon name = 'user' />{ listing.views ? listing.views : '0' } Views
                    <Button color='green' onClick = { viewListing } >View</Button>
                    {
                        canDelete ? (<Button color='red' onClick = { deleteListing } >Delete</Button>) : ('')
                    }
                </span>
            }
        key = { id }
    />
)

export default ListingCard;
