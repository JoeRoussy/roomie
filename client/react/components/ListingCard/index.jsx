import React from 'react';
import { Card, Icon, Image, Button, Label } from 'semantic-ui-react';

import './styles.css';

const ListingCard = ({
    listing,
    id,
    viewListing,
    canDelete = false,
    deleteListing
}) => (
    <Card key = { id } className='listingCard'>
        <Card.Content>
            <Label color='blue' floating><Icon name = 'user' />&nbsp;{ listing.views ? listing.views : '0' } Views</Label>
            {listing.images ? (
                <Image floated='right' size='small' src={`${process.env.ASSETS_ROOT}${listing.images[0]}`} />
            ) : (
                ''
            )}
            <Card.Header>{listing.name}</Card.Header>
            <Card.Meta>{listing.address}</Card.Meta>
            <Card.Description>
                <p className='price'>${listing.price}</p>
                <p>{listing.description}</p>
            </Card.Description>
        </Card.Content>
        <Card.Content extra>
            <div className='ui two buttons'>
                <Button basic color='green' onClick = { viewListing } >View</Button>
                {canDelete ? (<Button basic color='red' onClick={deleteListing}>Delete</Button>) : ('')}
            </div>
        </Card.Content>
    </Card>
)

export default ListingCard;
