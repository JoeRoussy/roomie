import React from 'react';
import { Container, Header, Icon, Image, Item, Label } from 'semantic-ui-react';
import { Carousel } from 'react-responsive-carousel';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './styles.css';

const showImages = (images) => images.map((image, i) =>
        <img key={i} src={`${process.env.ASSETS_ROOT}${image}`} />)

const ListingDisplay = ({
    listing,
    singleImage // Must be a full URL
}) => {

    let imagePortion;

    if (singleImage) {
        imagePortion = (
            <Image id='listingDisplaySingleImage' size='large' src={singleImage} />
        );
    } else {
        imagePortion = listing.images ? (
            <Carousel>
                {showImages(listing.images)}
            </Carousel>
        ) : (
            ''
        );
    }

    return (
        <Container id='listingDisplayWrapper'>
            <Header as='h2' icon textAlign='center'>
              <Header.Content>
                  { listing.name }
              </Header.Content>
            </Header>
            {imagePortion}
            <Item>
                  <Item.Content>
                      <Item.Header as='a'>{ `$${listing.price}` }</Item.Header>
                      <Item.Meta>
                          <span className='address'>{ `${listing.street}, ${listing.city} ${listing.postalCode}` }</span>
                      </Item.Meta>
                      <Item.Description>{ listing.description }</Item.Description>
                      <Item.Extra>
                          <Label icon='globe' content='View Map' />
                      </Item.Extra>
                  </Item.Content>
            </Item>
        </Container>
    );
}

export default ListingDisplay;
